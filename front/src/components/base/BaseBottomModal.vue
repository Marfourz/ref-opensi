<template>
  <div class="">
    <div
      class="fixed -top-10 bottom-0 right-0 left-0 bg-black opacity-50"
      v-if="show"
    ></div>
    <div
      class="bg-white flex justify-center pt-10 fixed bottom-0 left-0 right-0 top-12 rounded-t-2xl overflow-scroll"
      v-if="show"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
