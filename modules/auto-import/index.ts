import { defineNuxtModule } from "@nuxt/kit";
import type {
    VuetifyComponentsOptions,
    VuetifyComposablesOptions,
    VuetifyDirectivesOptions,
} from "vuetify/unimport-presets";
import {
    VuetifyComposables,
    VuetifyDirectives,
    buildAddonsOptions,
    prepareVuetifyComponents,
} from "vuetify/unimport-presets";
import type {Addon, AddonsOptions} from "unimport";
import type {AssetURLOptions, AssetURLTagConfig} from "@vue/compiler-sfc";
import type {ViteConfig} from "@nuxt/schema";
import defu from 'defu'
import { transformAssetUrls as vuetifyTransformAssetUrls } from 'vite-plugin-vuetify'

export interface ModuleOptions {
    composables?: VuetifyComposablesOptions
    directives?: VuetifyDirectivesOptions
    components?: VuetifyComponentsOptions
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vuetify-auto-import',
        configKey: 'vuetifyAutoImport',
        compatibility: {
            nuxt: '^3.0.0',
        },
        default: {}
    },
    async setup(options, nuxt) {

        const { directives, composables, components: vuetifyComponents } = options.moduleOptions

        nuxt.hook('imports:sources', (sources) => {
            sources.push(
                VuetifyDirectives(directives),
                VuetifyComposables(composables),
            )
        })

        const imports = nuxt.options.imports
        imports.addons = buildAddonsOptions(imports.addons as AddonsOptions | Addon[] | undefined)

        nuxt.hook('components:extend', async (c) => {
            const components = await prepareVuetifyComponents(vuetifyComponents)
            for (const component of components) {
                c.push({
                    pascalName: component.pascalName,
                    kebabName: component.kebabName,
                    export: component.export,
                    filePath: component.filePath,
                    shortPath: component.filePath,
                    chunkName: component.kebabName,
                    prefetch: false,
                    preload: false,
                    global: false,
                    mode: 'all',
                })
            }
        })
        // hack vuetify nuxt module removing the vuetify vite plugin
        nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
            if (vuetifyComponents.prefix) {
                const transformAssetUrls = createTransformAssetUrls(
                    viteInlineConfig,
                )
                viteInlineConfig.vue ??= {}
                viteInlineConfig.vue.template ??= {}
                viteInlineConfig.vue.template.transformAssetUrls = transformAssetUrls
            }
            viteInlineConfig.plugins = viteInlineConfig.plugins || []
            viteInlineConfig.plugins.push({
                name: 'remove:vuetify:import:nuxt',
                enforce: 'post',
                configResolved(config) {
                    const idx = config.plugins.findIndex(plugin => plugin.name === 'vuetify:import:nuxt')
                    if (idx > -1) {
                        config.plugins.splice(idx, 1)
                    }
                }
            })
        })
    }
})

export function createTransformAssetUrls(viteInlineConfig: ViteConfig) {
    let existingTransformAssetUrls = viteInlineConfig.vue?.template?.transformAssetUrls ?? {}

    let useURLOptions: AssetURLOptions | undefined
    if (typeof existingTransformAssetUrls === 'boolean') {
        existingTransformAssetUrls = {}
    }
    else if ('base' in existingTransformAssetUrls || 'includeAbsolute' in existingTransformAssetUrls || 'tags' in existingTransformAssetUrls) {
        useURLOptions = {
            base: existingTransformAssetUrls.base as string | undefined,
            includeAbsolute: existingTransformAssetUrls.includeAbsolute as boolean | undefined,
        }
        existingTransformAssetUrls = (existingTransformAssetUrls.tags ?? {}) as Record<string, string[]>
    }

    const prefixed = Object.entries(vuetifyTransformAssetUrls).reduce((acc, [key, value]) => {
        acc[key.replace(/^V/, 'Vuetify')] = value
        return acc
    }, {} as Record<string, string[]>)

    const transformAssetUrls = normalizeTransformAssetUrls(
        defu(existingTransformAssetUrls, prefixed)
    )

    if (!useURLOptions)
        return transformAssetUrls satisfies AssetURLTagConfig

    useURLOptions.tags = transformAssetUrls
    return useURLOptions
}

function toKebabCase(str = '') {
    return str
        .replace(/[^a-z]/gi, '-')
        .replace(/\B([A-Z])/g, '-$1')
        .toLowerCase()
}

function camelize(str: string): string {
    return str.replace(/-([a-z0-9])/g, g => g[1].toUpperCase())
}

function pascalize(str: string): string {
    let pascal = camelize(str)
    pascal = pascal.slice(0, 1).toUpperCase() + pascal.slice(1)
    return pascal
}

function normalizeTransformAssetUrls(transformAssetUrls: Record<string, string[]>) {
    /*
    We need to cover these 4 cases:

  <VCard :appendAvatar="~/assets/logo.svg"/>
  <v-card :append-avatar="~/assets/logo.svg" />
  <VCard appendAvatar="~/assets/logo.svg"/>
  <v-card append-avatar="~/assets/logo.svg" />
     */
    const names = new Set(Object.keys(transformAssetUrls))
    let kebab: string
    let pascal: string
    for (const name of names) {
        transformAssetUrls[name] = normalizeTransformAssetUrlsAttrs(transformAssetUrls[name])
        kebab = toKebabCase(name)
        pascal = pascalize(name)
        if (!names.has(kebab))
            transformAssetUrls[kebab] = [...transformAssetUrls[name]]

        if (!names.has(pascal))
            transformAssetUrls[pascal] = [...transformAssetUrls[name]]
    }

    return transformAssetUrls
}

function normalizeTransformAssetUrlsAttrs(attrs: string[]) {
    const result = new Set<string>()
    let kebab: string
    let camel: string
    let bind: boolean
    let idx: number
    for (const attr of attrs) {
        result.add(attr)
        idx = attr.indexOf(':')
        if (idx > 0)
            continue

        bind = idx === 0
        kebab = toKebabCase(bind ? attr.slice(1) : attr)
        camel = camelize(bind ? attr.slice(1) : attr)
        result.add(kebab)
        result.add(camel)
        result.add(`:${kebab}`)
        result.add(`:${camel}`)
    }

    return [...result]
}
