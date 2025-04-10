import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
      },
      dark: {
        dark: true,
      },
    },
  },
})
