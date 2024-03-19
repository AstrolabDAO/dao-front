<template lang="pug">
Notched.button.cursor-pointer(:direction="direction", :options="{ width: '20%', height: 60, notchWidth: 30, notchHeight: 25, strokeColor: '#477bff', borderRadius: 7, filter: 'neonGlow' }")
  template(#content)
    span.text.font-size-ml.uppercase.font-medium {{ props.text }}
  //- template(#content)
  //-   slot(name="content")
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    text: {
      type: String,
    },
    direction: {
      type: String,
      default: "tr", // top-right
    },
  },
  setup(props) {
    return {props};
  },
});
</script>

<style scoped lang="pcss">
.button {
  .text {
    padding-top: 3px;
  }
}

</style>
