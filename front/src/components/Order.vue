<template>
  <div class="w-full">
    <slot name="title"> </slot>
    <BaseTable :titles="titles" :data="order.items" >
      <template #product="{element}">
        <div class="flex items-center space-x-6">
            <img src="@/assets/images/beverage.png" alt="">
            <div class="flex flex-col ">
                <div class=" text-black font-semibold">{{ element.product.name }}</div>
                <div class="text-tableColor">{{ element.product.rackPrice }} / Casiers</div>
            </div>
            
        </div>
      </template>

      <template #quantity="{element}">
        <div class="font-semibold text-black">
            {{  element.quantity }} casiers
        </div>
      </template>

      <template #price="{element}">
        <div class="font-semibold text-black">
            {{  element.price }} F
        </div>
      </template>
    </BaseTable>

    
    <div class="mt-48 border-t pt-4 border-borderColor font-bold flex items-center justify-between" >
        <div>Total</div>
        <div>{{ order.totalAmount }} F</div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { IOrder } from "../types/interfaces";

export default defineComponent({
  props: {
    order: {
      type: Object as PropType<IOrder>,
      required: true,
    },
  },
  setup() {
    const titles = [
      {
        title: "Produit",
        name: "product",
      },
      {
        title: "Quantity",
        name: "quantity",
      },
      {
        title: "Prix",
        name: "price",
      },
    ];

    return {
      titles,
    };
  },
});
</script>

<style scoped></style>
