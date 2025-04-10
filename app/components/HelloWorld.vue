<template>
  <vuetify-container class="fill-height" max-width="900">
    <div>
      <vuetify-img
        class="mb-4"
        height="150"
        src="~/assets/logo.png"
      />

      <vuetify-btn
          density="compact"
          @click="onClick"
      >
        Click Me
      </vuetify-btn>
      <lazy-vuetify-btn
          density="compact"
          :hydrate-after="2000"
          @click="onClick"
          @hydrated="onHydrated"
      >
        Lazy Delayed Click Me
      </lazy-vuetify-btn>

      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">Vuetify</h1>
      </div>

      <vuetify-row>
        <vuetify-col cols="12">
          <vuetify-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <vuetify-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                Get started
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Change this page by updating <vuetify-kbd>{{ `<HelloWorld />` }}</vuetify-kbd> in <vuetify-kbd>components/HelloWorld.vue</vuetify-kbd>.
              </div>
            </template>
          </vuetify-card>
        </vuetify-col>

        <vuetify-col v-for="link in links" :key="link.href" cols="6">
          <vuetify-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :href="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"
            target="_blank"
            :title="link.title"
            variant="tonal"
          />
        </vuetify-col>
      </vuetify-row>
      <lazy-vuetify-btn
          density="compact"
          hydrate-on-visible
          @click="onClick"
          @hydrated="onVisibleHydrated"
      >
        Lazy OnVisible Click Me
      </lazy-vuetify-btn>
    </div>
  </vuetify-container>
</template>

<script setup>
function onHydrated() {
  console.log("onHydrated")
}
function onVisibleHydrated() {
  console.log("onVisibleHydrated")
}
function onClick() {
  console.log("onClick")
}
  const links = [
    {
      href: 'https://vuetifyjs.com/',
      icon: 'mdi-text-box-outline',
      subtitle: 'Learn about all things Vuetify in our documentation.',
      title: 'Documentation',
    },
    {
      href: 'https://vuetifyjs.com/introduction/why-vuetify/#feature-guides',
      icon: 'mdi-star-circle-outline',
      subtitle: 'Explore available framework Features.',
      title: 'Features',
    },
    {
      href: 'https://vuetifyjs.com/components/all',
      icon: 'mdi-widgets-outline',
      subtitle: 'Discover components in the API Explorer.',
      title: 'Components',
    },
    {
      href: 'https://discord.vuetifyjs.com',
      icon: 'mdi-account-group-outline',
      subtitle: 'Connect with Vuetify developers.',
      title: 'Community',
    },
  ]
</script>
