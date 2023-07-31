<template>
  <div >
    <div
      class="fixed top-0 bottom-0 right-0 left-0 bg-black opacity-50"
      v-if="show"
    ></div>
    <div
      class="bg-white flex justify-center md:pt-10 pt-5 fixed bottom-0 left-0 right-0 md:top-12 top-0 md:rounded-t-2xl overflow-scroll"
      v-if="show"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
