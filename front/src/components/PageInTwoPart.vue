<template>
  <div class="flex h-[calc(100vh-56px)]">
    <div class="lg:w-[63%] border-r-2 py-10 px-6">
        <slot name="firstPart"></slot>
    </div>
    <div class="lg:w-[37%] py-10 px-6 h-[calc(100vh-56px)] overflow-scroll ">

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
