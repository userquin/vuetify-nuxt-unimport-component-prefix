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
            console.log(components)
            console.log(composables)
            console.log(directives)
            console.log(vuetifyComponents)
            console.log(options)
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
