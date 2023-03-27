<template>
  <div
    class="font-semibold border rounded uppercase flex space-x-1 justify-center px-2 items-center text-sm align-center w-[90px]"
    style="font-size:12px" :class="{
      'bg-fadeWarning text-warning  border-warning': type == 'warning',
      'bg-fadeDanger text-danger border-danger': type == 'danger',
      'bg-fadeSucces text-success border-success': type == 'success',
      'text-[#2062F6] border-[#2062F6] bg-[#F0F5FF]': type == 'blue',
      'text-[#6929C4] bg-[#F3F0FA] border-[#6929C4]': type == 'colorize',
    }">

    {{ title }}

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export enum BaseTableStatutType {
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
  BLUE = "blue",
  COLORIZE = "colorize"
}

export default defineComponent({
  props: {
    type: {
      type: String as () => BaseTableStatutType,
      default: "success",

    },
    title: {
      type: String
    }
  },

  setup() {
    return {

    }
  }

});
</script>

<style lang="scss" scoped></style>
