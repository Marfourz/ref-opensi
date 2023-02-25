<template>
  <div
    class="
      rounded-40
      h-9
      w-52
      border border-[#6B7A99]
      bg-[#F4F6F9]
      cursor-pointer
      items-center
    "
  >
    <div class=" font-bold text-xs text-center py-2 px-4">
      {{ labels }}
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
defineProps(["labels"]);
</script>
