<template>
  <div class="flex h-full">
    <div class="lg:w-[63%] py-10 pr-6">
      <slot name="firstPart"></slot>
    </div>
    <span class="border-r-2 mt-8"></span>
    <div class="lg:w-[37%] py-10 px-6">
      <slot name="secondPart" class="w-full"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
