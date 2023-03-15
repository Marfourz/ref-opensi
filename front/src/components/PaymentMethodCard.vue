<template>
  <div class="flex space-x-2 items-center">
    <BaseSelecteCard>
      <BaseIcon :name="icon"></BaseIcon>
    </BaseSelecteCard>
    <div class="font-semibold">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const selected = ref(true);

    function onClick() {
      selected.value = !selected.value;
      context.emit("selected", selected.value);
    }
    return {
      selected,
      onClick,
    };
  },
});
</script>

<style scoped></style>
