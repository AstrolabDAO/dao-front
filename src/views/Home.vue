<template lang="pug">
.home
  span Home
  Button(:text="'Click me'" direction="tr")
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Home',
  props: {},
  components: {},
  setup() {
    onMounted(async () => { });
    return {
    };
  },
});

</script>
<style scoped></style>
