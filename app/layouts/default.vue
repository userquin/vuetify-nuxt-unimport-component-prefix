<script setup lang="ts">
import {ssrClientHintsConfiguration} from "virtual:vuetify-ssr-client-hints-configuration";

const theme = useVTheme()

const enableToogleTheme = computed(() => {
  if (ssrClientHintsConfiguration.prefersColorScheme && ssrClientHintsConfiguration.prefersColorSchemeOptions)
    return !ssrClientHintsConfiguration.prefersColorSchemeOptions.useBrowserThemeOnly

  return false
})

function toogleTheme() {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <vuetify-app>
    <header class="layout-header">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/calendar">Calendar</NuxtLink>
      <vuetify-btn v-if="enableToogleTheme" icon @click="toogleTheme" title="Toggle Theme">
        <vuetify-icon :icon="theme.global.name.value === 'dark' ? 'mdi-brightness-6' : 'mdi-brightness-4'" />
      </vuetify-btn>
    </header>
    <vuetify-divider />
    <vuetify-main>
      <slot />
    </vuetify-main>
    <app-footer />
  </vuetify-app>
</template>

<style lang="scss" scoped>
.layout-header {
  width: 100%;
  min-height: 44px;
  margin: 1rem auto;
  display: grid;
  text-align: center;
  grid-template-columns: repeat(3, min-content);
  grid-column-gap: 1rem;
  align-items: center;
  justify-content: center;
}
</style>
