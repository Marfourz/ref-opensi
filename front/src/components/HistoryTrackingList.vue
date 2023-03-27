<template>
  <div class="py-8 px-6">
    <div class="flex justify-between items-center mb-8">
      <div class="text-2xl font-semibold">Historique</div>
      <BaseIcon
        name="close"
        class="w-5 h-5 cursor-pointer"
        @click="$emit('close')"
      ></BaseIcon>
    </div>
    <div class="flex mt-8 space-x-2">
      <div class="font-semibold text-base">Commande {{ orderId }}</div>
      <BaseTableStatut
        :title="orderStatusLabel"
        :type="orderStatus"
        ></BaseTableStatut
      >
    </div>
    <div class="mt-4">
      <HistoryTracking
        type="created"
        :date="order_created.date"
        v-if="order_created"
      ></HistoryTracking>
    </div>
    <div class="mt-4">
      <HistoryTracking
        type="validated"
        :date="order_accepted.date"
        v-if="order_accepted"
      ></HistoryTracking>
    </div>
    <div class="mt-4">
      <HistoryTracking
        type="submitted"
        :date="order_delivered.date"
        v-if="order_delivered"
      ></HistoryTracking>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import HistoryTracking from "@/components/HistoryTracking.vue";
import { IOrderHistory } from "@/types/interfaces";
import { useOrdersStore } from "@/stores/orders";
import BaseTableStatut from "./base/BaseTableStatut.vue";
import { OrderStatus } from "../types/enumerations";
``;

export default defineComponent({
  components: { HistoryTracking, BaseTableStatut },

  props: {
    order_created: Object as PropType<IOrderHistory>,
    order_accepted: Object as PropType<IOrderHistory>,
    order_delivered: Object as PropType<IOrderHistory>,
    orderId: { type: String, required: true },
    orderStatus: { type: String },
    orderStatusLabel: { type: String },
  },

  setup(props) {
    const orderStore = useOrdersStore();
    const infoHistoryOrder = ref();

    onMounted(async () => {
      const response = await orderStore.historyOrder(props.orderId);
      infoHistoryOrder.value = response;
    });

    return {};
  },
});
</script>
