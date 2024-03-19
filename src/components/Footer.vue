<template lang="pug">
footer.w-full.h-7.mt-2.flex-h.y-center.font-light.font-size-s
  nav.w-xxl.h-full.mx-auto.flex-h.y-center.x-space-btw.text-white.z-inherit
    .copyright.cursor-pointer.flex-h.x-start.y-center(@click="scrollTop")
      .text-left.text-center © {{ new Date().getFullYear() }} Astrolab DAO
    ul.flex-h.y-center.gap-6
      li.nav-item(v-for="route in routes" :key="route.title")
        a(:href="route.path ? route.path : '#'") {{ route.title }}
      Svg.cursor-pointer.w-5.h-5.fill-white(icon="/svgs/astrolab.svg", @click="scrollTop")
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { routeTo, scrollTop } from './Router.vue';
import { NavRoute } from '../models/types';

const routes: NavRoute[] = [
  { title: "ToS", path: "#/tos"},
  { title: "Risk", path: "#/risk-disclaimer"},
  { title: "Privacy", path: "#/privacy-policy"}
];

const externalLinks: NavRoute[] = [
  { title: 'Docs', icon: '/svgs/docs.svg', path: '#/docs' },
  { title: 'X', icon: '/svgs/x.svg', path: 'https://x.com/AstrolabDAO' },
  { title: 'Github', icon: '/svgs/github.svg', path: 'https://github.com/AstrolabDAO' }
];

export default defineComponent({
  name: 'Footer',
  props: {},
  components: {},
  setup() {
    onMounted(async () => { });
    return {
      routes,
      externalLinks,
      routeTo,
      scrollTop
    };
  },
});

</script>

<style scoped></style>
../models/models/types