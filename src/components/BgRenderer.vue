<template lang="pug">
WebGlRenderer.bgRenderer.fixed.top-0.left-0(:shaders='["grid-tunnel-frag.glsl", "base-vert.glsl"]')
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import WebGlRenderer from './WebGlRenderer.vue';

export default defineComponent({
  name: 'BgRenderer',
  props: {},
  components: { WebGlRenderer },
  setup() {
    onMounted(async () => { });
    return {};
  },
});

</script>
<style scoped></style>
