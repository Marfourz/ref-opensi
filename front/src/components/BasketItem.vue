<template>
  <div class="flex justify-between items-center border rounded shadow py-3 p-3 font-semibold">
    <img src="@/assets/images/beverage.png" alt="">
    <div class="space-y-1">
      <div >{{ product.name }}</div>
      <div
        class="rounded-full border flex items-center w-fit h-fit px-6 py-2.5 space-x-2"
      >
        <div>{{ quantity }} casiers</div>
        <BaseIcon name="editProduct" @click="edit"></BaseIcon>
        <BaseIcon name="close" @click="close"></BaseIcon>
      </div>
     
    </div>
    <div class="font-semibold">
        {{ quantity }} x {{ product.packPrice }}
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue"
import type { IProduct } from "../types/interfaces";

export default defineComponent({
  props:{
    product : {
      type : Object as PropType<IProduct>,
        required : true
    },
    quantity : {
      type : Number,
      required : true
    }
  },
  setup() {
    function edit(){}
    function close(){}
    return {
      edit,
      close
    };
  },
});
</script>

<style scoped></style>
