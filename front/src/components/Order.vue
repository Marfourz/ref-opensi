<template>
  <div class="w-full h-full flex flex-col relative overflow-hidden">
    <slot name="title"> </slot>

    <div class="overflow-scroll">
      <BaseTable :titles="titles" :data="order.items" class="my-4" v-if="order">
        <template #product="{ element }">
          <div class="flex items-center space-x-6">
            <img src="@/assets/images/beverage.png" alt="" />
            <div class="flex flex-col">
              <div class="text-black font-semibold">
                {{ element.product.name }}
              </div>
              <div class="text-tableColor">
                {{ element.product.bulkPrice }} / Casiers
              </div>
            </div>
          </div>
        </template>

        <template #quantity="{ element }">
          <div class="font-semibold text-black">
            {{ element.quantity }} casiers
          </div>
        </template>

        <template #price="{ element }">
          <div class="font-semibold text-black">
            {{
              helpers.currency(element.product.bulkPrice * element.quantity)
            }}
            F
          </div>
        </template>
      </BaseTable>
    </div>

    <div
      class="bg-white pt-1 absolute bottom-0 left-0 right-0 border-t border-borderColor "
    >
      <div class="mt-4 flex font-bold  items-center justify-between w-full">
        <div>Total</div>
        <div class="mr-5">{{ order.totalAmount }} F</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { PropType } from "vue";
import type { IOrder } from "../types/interfaces";
import helpers from "@/helpers/index";

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
        title: "Quantité",
        name: "quantity",
      },
      {
        title: "Prix",
        name: "price",
      },
    ];

    return {
      titles,
      helpers,
    };
  },
});
</script>

<style scoped></style>
