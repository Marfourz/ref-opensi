<template>
  <div class="rounded-lg p-3 shadow-lg flex space-x-3 border border-[#6B7A99]">
    <div
      class="w-[52px] h-[52px] flex items-center justify-center rounded-full"
      :style="'background-color:' + data.secondaryColor"
    >
      <BaseIcon
        :name="data.icon"
        :style="'color:' + data.primaryColor"
      ></BaseIcon>
    </div>
    <div class="space-y-2">
      <div class="font-[500] text-[14px] text-[#0F0F14]">
        {{ data.subtitle }}
      </div>
      <div class="font-bold">{{ data.title }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export interface IDashboardCard {
  title: string;
  subtitle: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
}

export default defineComponent({
  props: {
    data: {
      type: Object as () => IDashboardCard,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
