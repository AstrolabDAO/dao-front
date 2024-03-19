<template lang="pug">
.bordered.p-3.backdrop-blur-light.w-full.h-l
  span About
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'About',
  props: {},
  components: {},
  setup() {
    onMounted(async () => { });
    return {};
  },
});

</script>
<style scoped></style>
