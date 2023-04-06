<template>
  <div
    class="items-center flex w-full lg:space-x-7 space-x-3.5  cursor-pointer lg:text-white text-[#6B7A99"
    :class="{
      'lg:text-yellow text-[#259475] ': isActive,
    }"
  >
    <div class="w-1 h-12 ml-2 lg:ml-0" :class="{ 'lg:bg-yellow bg-[#259475]': isActive }"></div>
    <div>
      <BaseIcon :name="icon" class="w-5 h-5"></BaseIcon>
    </div>
    <div class="" v-if="!showOnlyIcon">{{ label }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    showOnlyIcon: {
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
