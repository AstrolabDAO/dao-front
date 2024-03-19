<template lang="pug">
BgRenderer.w-full.h-full.z-0
Header.z-50
Router.z-10.mt-9
Footer.z-10
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BgRenderer from './components/BgRenderer.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Router from './components/Router.vue';

export default defineComponent({
  name: 'App',
  components: {
    BgRenderer,
    Header,
    Footer,
    Router,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
</style>
