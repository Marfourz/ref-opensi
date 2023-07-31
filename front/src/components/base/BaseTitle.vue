<template>
  <div class="font-semibold md:text-2xl text-lg">
    {{ title }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
  },
});
</script>

<style scoped></style>
