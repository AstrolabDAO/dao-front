<template lang="pug">
template(v-if="selectedAction")
  .action.text-center.h1.flex-v.x-center
    .mx-4.mr-2.extra-light.opacity-70 Algorithmically
    .h-12
      template(v-if="!!selectedProtocol")
        .flex-h.y-center.mt-7.scale-150p.opacity-0.transit-all-slow(ref="protocolRef")
          span.bold.mr-2.text-gradient.overflow-visible(:style="selectedProtocol.themedFgGradient()") {{ selectedAction }}
          span.bold {{ selectedProtocol.stripName() }}
          Svg.ml-3.w-8.round.bordered.thicker(:icon="selectedProtocol.logo")

    span.mr-2.extra-light.opacity-70.h4 All in one vault.

//- .title.slogan.bold.text-center.h3.md_twop6rem(v-html="State.content.home.title")
//- .subtitle.description.h4.text-grey.my-7.px-2.md_text-h3(v-html="State.content.home.subtitle")
</template>

<script lang="ts">
import { Ref, defineComponent, onMounted, ref } from 'vue';
import { cache } from '../store';
import { Protocol } from '../models/web3';
import { PROTOCOL_SHOWCASE_TYPES, PROTOCOL_NAMES_BY_TYPE, PROTOCOL_ACTIONS_BY_TYPE } from '../models/enums';
import { sleep } from '../utils/typing';

export default defineComponent({
  name: "Home Title",
  setup: () => {
    const protocols = ref([]) as Ref<Protocol[]>;
    const selectedProtocol = ref<Protocol>();
    const selectedAction = ref<string>("Farm on");
    const selectedCategory = ref(0);
    const protocolRef = ref() as Ref<HTMLElement>;
    const categories = ref<any>([]);

    onMounted(async () => {
      protocols.value = await cache.protocols.getAll();
      categories.value = PROTOCOL_SHOWCASE_TYPES.map(t => ({
        protocols: protocols.value.filter(p => p.types.includes(t)),
        names: PROTOCOL_NAMES_BY_TYPE[t],
      }));
    });

    const routineId = setInterval(async () => {
      if (!protocolRef.value) {
        clearInterval(routineId);
        console.info("Stopped home page routines");
        return;
      }
      protocolRef.value!.style.opacity = "0%";
      await sleep(500);
      selectedProtocol.value = undefined;
      await sleep(100);
      selectedProtocol.value = protocols.value[Math.floor(Math.random() * protocols.value.length)];
      const actions = selectedProtocol.value.types.map(t => PROTOCOL_ACTIONS_BY_TYPE[t]).flat();
      selectedAction.value = actions[Math.floor(Math.random() * actions.length)] || "Farm on";
      selectedCategory.value = Math.floor(Math.random() * PROTOCOL_SHOWCASE_TYPES.length);
      await sleep(100);
      protocolRef.value!.classList.add("view-change-leave-to");
    }, 5000);

    onMounted(() => {
      protocolRef.value!.classList.add("view-change-enter-to");
    });

    return { protocols, categories, selectedProtocol: selectedProtocol.value, selectedAction, selectedCategory, protocolRef };
  },
});
</script>
