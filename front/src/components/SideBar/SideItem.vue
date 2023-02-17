<template>
    <div
      class="items-center flex w-full space-x-7 cursor-pointer text-white"
      :class="{
        'text-yellow': isActive,
      }"
    >
      <div class="w-1 h-12" :class="{ 'bg-yellow': isActive }"></div>
      <div>
        <BaseIcon :name="icon"></BaseIcon>
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
      showOnlyIcon:{
        type : Boolean,
        default : false
      }
    },
    setup() {
      return {};
    },
  });
  </script>
  
  <style scoped></style>
  