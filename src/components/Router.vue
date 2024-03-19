
<template lang="pug">
.router.w-xxl.mx-auto.relative(ref="container")
  transition(name="view-change" @before-leave="bgDash" @enter="scrollTop" appear)
    component.z-inherit.absolute(:is="view" v-bind="viewProps" class="transition-container"  :key="pathname" )
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch } from 'vue'
import { Route } from '../models/types'
import { bg, router } from '../store';

// Define routes with component and props
const routes: {[path: string]: Route } = {
  '/': { title: 'Home' },
  '/products': { title: 'Products' },
  '/vaults': { title: 'Vaults' },
  '/radyal': { title: 'Radyal' },
  '/swapper': { title: 'Swapper' },
  '/botnet': { title: 'Botnet' },
  '/cm3': { title: 'Cm3' },
  '/about': { title: 'About' },
  '/team': { title: 'Team' },
  '/partners': { title: 'Partners' },
  '/links': { title: 'Links' },
  '/not-found': { title: 'Not Found' },
  '/tos': { title: 'Md', props: { file: 'legal/tos.md' } },
  '/privacy-policy': { title: 'Md', props: { file: 'legal/privacy-policy.md' } },
  '/cookie-policy': { title: 'Md', props: { file: 'legal/cookie-policy.md' } },
  '/risk-disclaimer': { title: 'Md', props: { file: 'legal/risk-disclaimer.md' } },
  '/acknowledgement': { title: 'Md', props: { file: 'legal/acknowledgement.md' } },
  '/docs': { title: 'Md', props: { file: 'docs/index.md' } },
}

window.addEventListener('hashchange', (event) => {
  event.preventDefault();
  routeTo(window.location.hash.substring(1) || '/');
});

export const bgDash = () => {
  const init = .03;
  bg.speed *= 15;
  setTimeout(() => bg.speed = init, 1500);
}

export const routeTo = (path="/") => {
  if (path === router.pathname.value)
    return window.history.replaceState({}, '', path);
  if (path.startsWith('/')) {
    router.pathname.value = path;
    return window.history.pushState({}, '', path);
  }
  // window.location.href = path;
  window.open(path, '_blank')?.focus()
}

export const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const render = async () => {
  const match = router.pathname.value in routes ? router.pathname.value : '/not-found';
  const route = routes[match];

  if (match !== router.pathname.value)
    window.history.pushState({}, '', match);

  if (route)
    router.viewProps.value = route.props ?? {};
  router.view.value = (await (import(`../views/${route.title.replace(" ", "")}.vue`))).default;
}

watch(router.pathname, async () => render());

export default defineComponent({
  name: 'Router',
  props: {
    initial: { type: String }
  },
  setup(props) {
    const container = ref<HTMLElement>();
    onMounted(async () => {
      if (props.initial)
        window.history.pushState({}, '', props.initial);
      if (container.value) {
        router.element = container.value;
        router.rect = container.value.getBoundingClientRect();
      }
      await render();
    });
    return {
      view: router.view,
      viewProps: router.viewProps,
      pathname: router.pathname,
      scrollTop,
      bgDash,
      container
    }
  },
})
</script>

<style scoped lang="pcss">
.router {
  min-height: calc(100% - 6rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>
