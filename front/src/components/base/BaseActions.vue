<template>
  <div
    class="bg-white rounded-lg shadow-lg right-20 mt-2 flex flex-col cursor-pointer absolute"
  >
    <div
      v-for="action in actions"
      :key="action.title"
      class="flex items-center space-x-6 px-6 py-3 hover:bg-gray-100"
      @click="action.action(data)"
    >
      <BaseIcon :name="action.icon"></BaseIcon>
      <div>{{ action.title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface IAction {
  title: string;
  icon: string;
  action: Function;
}

export default defineComponent({
  props: {
    data: null,
    actions: {
      type: Array as PropType<Array<IAction>>,
    },
  },
  setup() {
    function onClick() {}
    return {};
  },
});
</script>

<style scoped></style>
