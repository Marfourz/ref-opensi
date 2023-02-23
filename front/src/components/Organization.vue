<template>
  <div
    class="
      rounded-lg
      border border-[#6B7A99]
      bg-[#F4F6F9]
      h-20
      w-25
      cursor-pointer
      flex-col flex
      items-center
    "
    :class="{ 'text-white bg-green': isActive, border: !isActive }"
  >
    <div class="">
      <BaseIcon name="Valided"></BaseIcon>
    </div>
    <div class="text-black font-bold text-xs text-center mt-2">
      {{ labels }}
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
// import { defineComponent } from "vue";
defineProps(["labels", "icons", "isActive"]);

// export default defineComponent({
//   components: {},
//   emits: [],
//   props: {
//     labels: {
//       type: String,
//     },
//     // Icons: {
//     //   type: String,
//     // },
//     isActive: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   setup() {},
// });
</script>
