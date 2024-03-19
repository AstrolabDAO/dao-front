<template lang="pug">
header.fixed.w-full.top-0.h-7.flex-h.y-center
  nav.w-xxl.h-full.mt-3.mx-auto.flex-h.y-center.x-space-btw.text-white
    Svg.logo.w-13.h-full.fill-white.cursor-pointer(icon="/svgs/logo-text.svg", @click="routeTo('/')")
    ul.flex-h.gap-6.mt-2
      li.nav-item(v-for="route in routes" :key="route.title")
        a.font-size-ml.uppercase.font-medium(:href="route.path ? route.path : '#'") {{ route.title }}
        ul.dropdown.transition-all.flex-v(v-if="route.children?.length > 0")
          li(v-for="child in route.children" :key="child.title")
            a.font-light(:href="child.path") {{ child.title }}
    ul.flex-h.gap-2.external-links
      li.nav-item.tooltip(v-for="link in externalLinks" :key="link.title" :data-tooltip="`Go to ${link.path ?? '??'}`")
        a(:href="link.path")
          Svg.w-6.h-6.fill-white(:icon="link.icon")

</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { NavRoute } from '../models/types';
import { routeTo } from './Router.vue';

const routes: NavRoute[] = [
  // { title: 'Home', path: '#/' },
  {
    title: 'Products', path: '#/products', children: [
      { title: 'Vaults', path: '#/vaults' },
      { title: 'Radyal', path: '#/radyal' },
      { title: 'Swapper', path: '#/swapper' },
      { title: 'Botnet', path: '#/botnet' },
      { title: 'CM3', path: '#/cm3' },
    ]
  },
  {
    title: 'About', path: '#/about', children: [
      { title: 'Partners', path: '#/partners' },
      { title: 'Team', path: '#/team' },
      { title: 'Audits', path: '#/audits' },
      { title: 'Disclaimer', path: '#/risk-disclaimer' },
    ]
  },
];

const externalLinks: NavRoute[] = [
  { title: 'Docs', icon: '/svgs/docs.svg', path: '#/docs' },
  { title: 'X', icon: '/svgs/x.svg', path: 'https://x.com/AstrolabDAO' },
  { title: 'Github', icon: '/svgs/github.svg', path: 'https://github.com/AstrolabDAO' }
];

export default defineComponent({
  name: 'Header',
  props: {},
  components: {},
  setup() {
    onMounted(async () => { });
    return {
      routes,
      externalLinks,
      routeTo
    };
  },
});

</script>

<style scoped>
.nav-item {
  position: relative;
}

.dropdown {
  max-height: 0;
  position: absolute;
  left: 0;
  top: 50%;
  opacity: 0;
  margin-top: .3rem;
  background-color: var(--bg-0);
  color: var(--fg-0);
  min-width: var(--xs);
  overflow: hidden;
  z-index: 1000;
  border: 0 solid var(--border-color);
  border-radius: var(--border-radius);
}

.nav-item:hover .dropdown {
  top: 100%;
  opacity: 1;
  max-height: var(--s);
  border: var(--border-width) solid var(--border-color);
  padding: var(--unit-1) var(--unit-2);
}

a:hover {
  color: var(--secondary);
}
</style>
