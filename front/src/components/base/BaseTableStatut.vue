<template>
  <div
    class="font-semibold border rounded  flex space-x-1 justify-center px-2 items-center text-sm align-center w-[90px]"
    style="font-size:12px"
    :class="{
      'bg-fadeWarning text-warning  border-warning': type == 'warning',
      'bg-fadeDanger text-danger border-danger': type == 'danger',
      'bg-fadeSucces text-success border-success': type == 'success',
      'underline text-[#2062F6]': type=='colorize',
    }"
  >
   
    {{title}}
   
  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String as () => 'success' | 'danger' | 'warning' | 'colorize',
      default: "success",
      
    } ,
    title: {
      type : String
    }
  },
  
  setup(){
    return {

    }
  }
  
});
</script>

<style lang="scss" scoped>
</style>