<template>

  <div
    class="flex space-x-4 justify-center items-center p-2 text-center text-grey-70"
   
    :key="totalElements"
  >
    
    <span
      >{{ peerPage * actualPage - peerPage + 1 }} -
      <span v-if="peerPage * actualPage > totalElements">
        {{ peerPage * actualPage - peerPage + (totalElements % peerPage) }}
      </span>
      <span v-else>
        {{ peerPage * actualPage }}
      </span>
      sur {{ totalElements }}</span
    >
    <span class="cursor-pointer" @click.prevent.stop="previous()" ref="pagination">
      <BaseIcon name="arrowLeft" class="text-grey-70"/>
    </span>
    <span class="cursor-pointer" @click.prevent.stop="next()" ref="pagination">
      <BaseIcon name="arrowRigth" class="text-grey-70"/>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  emits: ['change'],
  props: {
    totalElements: {
      type: Number,
      required: true,
      default : 100
    },
    peerPage: {
      type: Number,
      default: 10,
    },
  },

  setup(props, context) {
    const actualPage = ref(1);
    function next() : void {
      if (actualPage.value * props.peerPage < props.totalElements) {
        ++actualPage.value;
        context.emit("change", actualPage.value);
      }
    }
    function previous() : void{
      if (actualPage.value > 1) {
        --actualPage.value;
        context.emit("change", actualPage.value);
      }
    }

    return {
      actualPage,
      previous,
      next,
    };
  },
});
</script>

<style lang="scss" scoped></style>
