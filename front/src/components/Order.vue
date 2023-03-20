<template>
  <div class="w-full h-full relative overflow-hidden ">
    <slot name="title"> </slot>

    <BaseTable
      :titles="titles"
      :data="order.items"
      
      class="mt-2 h-[calc(100vh-200px)] overflow-scroll"
      v-if="order"
    >
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
          {{ helpers.currency(element.product.bulkPrice * element.quantity) }} F
        </div>
      </template>
    </BaseTable>

    <div
      class="absolute bottom-0 left-0 right-0 border-t pt-4 border-borderColor font-bold flex items-center justify-between"
    >
      <div>Total</div>
      <div>{{ order.totalAmount }} F</div>
    </div>

    <!-- <BaseRightModal :show="true" >
      <div class="py-8 px-6">
        <div class="flex justify-between items-center mb-8">
          <div class="text-2xl font-semibold">Historique</div>
          <div><BaseIcon name="close" class="w-5 h-5"></BaseIcon></div>
          
        </div>

        <VHistorical></VHistorical>

      </div>
    </BaseRightModal> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { IOrder } from "../types/interfaces";
import helpers from "@/helpers/index";
import BaseRightModal from "./base/BaseRightModal.vue";
import VHistorical from "./VHistorical.vue";

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
    components: { BaseRightModal, VHistorical }
});
</script>

<style scoped></style>
