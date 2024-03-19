<template lang="pug">
.notched.container(ref="container" :style="containerStyle")
  template(v-if="pathData")
    svg(width="0" height="0" fill="none" xmlns="http://www.w3.org/2000/svg")
      defs
        clipPath(:id="pathId")
          path(:d="pathData" :transform="svgTransform")
    .absolute.w-full.h-full(:style="clippedDivStyle")
      .clipped.flex-h.x-center.y-center.h-full.backdrop-blur-light
        slot(name="content")
    svg.inner.absolute.overflow-visible.pointer-events-none(:style="{ width: o.width, height: o.height}" :viewBox="`0 0 ${o.width} ${o.height}`" fill="none" xmlns="http://www.w3.org/2000/svg")
      path(:d="pathData" :stroke="o.strokeColor" :stroke-width="o.strokeWidth" :filter="filterUrl" :transform="svgTransform")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { DEFAULT_SVG_OPTIONS, SvgContainerOptions, adjustDimensions, flipSvgTransform, generateNotchedPath } from '../utils/rendering';
import { router } from '../store';
import { generateHash } from '../utils/crypto';

export default defineComponent({
  name: 'Notched',
  props: {
    options: {
      type: Object as () => SvgContainerOptions,
    },
    direction: {
      type: String,
      default: "tr", // top-right
    },
  },
  setup(props) {
    const container = ref<HTMLElement>();
    const o = { ...DEFAULT_SVG_OPTIONS, ...props.options };
    const pathData = ref(o.pathData);
    const containerStyle = ref("");
    const svgTransform = ref("");
    const filterUrl = o.filter ? `url(#${o.filter})` : "";
    const pathId = "clip" + generateHash(6);
    const clippedDivStyle = `-webkit-clip-path: url(#${pathId}); clip-path: url(#${pathId});`;

    onMounted(() => {
      if (container.value) {
        [o.width, o.height, o.notchWidth, o.notchHeight, o.borderRadius] = [
          adjustDimensions(o.width, router.rect.width),
          adjustDimensions(o.height, router.rect.height),
          adjustDimensions(o.notchWidth, router.rect.width),
          adjustDimensions(o.notchHeight, router.rect.height),
          adjustDimensions(o.borderRadius, router.rect.width),
        ];
        pathData.value = generateNotchedPath(o);
        containerStyle.value = `position: relative; width: ${o.width!}px; height: ${o.height!}px;`;
        svgTransform.value = flipSvgTransform(o, props.direction);
      }
    });

    return {
      container,
      filterUrl,
      containerStyle,
      clippedDivStyle,
      svgTransform,
      pathId,
      pathData,
      o
    };
  },
});
</script>
<style scoped>
/* Add any additional styling here */
</style>
