<template>
    <div>
      <div
        class="fixed -top-10 bottom-0 right-0 left-0 bg-black opacity-50"
        v-if="show"
      ></div>
      <div
        class="bg-white  pt-10 fixed bottom-0  top-0 h-screen right-0 w-[30%]   overflow-scroll"
        v-if="show"
      >
        
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  
  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      return {};
    },
  });
  </script>
  
  <style scoped></style>
  