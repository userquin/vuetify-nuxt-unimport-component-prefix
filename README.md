# Vuetify Vue Lazy Hydration with Nuxt

This repository includes (`main` branch):
- using [Vuetify unimport](https://github.com/vuetifyjs/vuetify/pull/21129) PR: prefix Vuetify directives, components and composables.
- Nuxt Vue Lazy Hydration patching Nuxt hydration module to include slots: check [fix(nuxt): pass slots through to lazy hydrated components](https://github.com/nuxt/nuxt/pull/31649/files) from Daniel Roe, it should be fixed in Nuxt 3.17.0.

The `use-unplugin-vuetify` branch includes:
- using [unplugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/pull/347) PR: prefix Vuetify directives, components and composables.
- Nuxt Vue Lazy Hydration patching Nuxt hydration module to include slots: check [fix(nuxt): pass slots through to lazy hydrated components](https://github.com/nuxt/nuxt/pull/31649/files) from Daniel Roe, it should be fixed in Nuxt 3.17.0.

When switching between `main` and `use-unplugin-vuetify` branches, run `pnpm install` to update the dependencies.