<template>
  <div
    class="rounded-40 p-1 w-fit border border-[#D3D8E6] cursor-pointer items-center"
  >
    <div class="font-bold text-xs text-center py-2 px-4">
      {{ labels }}
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
defineProps(["labels"]);
</script>
