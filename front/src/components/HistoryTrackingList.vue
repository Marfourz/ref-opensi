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
      <div class="font-semibold text-base">Commande {{ order.reference }}</div>
      <BaseTableStatut
        :title="orderStatusLabel"
        :type="orderStatus"
      ></BaseTableStatut>
    </div>
    <div class="space-y-4 mt-4">
      <HistoryTracking
        v-for="history in infoHistoryOrder"
        :type="history.status"
        :key="history.actor.id"
        :date="history.date"
        :name="history.actor.ownerName"
      ></HistoryTracking>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import HistoryTracking from "@/components/HistoryTracking.vue";
import { IOrderHistory, IOrder } from "@/types/interfaces";
import { useOrdersStore } from "@/stores/orders";

export default defineComponent({
  components: { HistoryTracking },

  props: {
    orderId: { type: String, required: true },
    orderStatus: {type : String as ()=> | "success"
        | "danger"
        | "warning"
        | "colorize"
        | "blue",},
    orderStatusLabel: { type: String },
    order : { 
      required: true,
      type: Object as PropType <IOrder> ,
    }
  },
// OrderStatus
  setup(props) {
    const orderStore = useOrdersStore();
    const infoHistoryOrder = ref<Array<IOrderHistory>>([]);

    onMounted(async () => {
      console.log("dvfvfgbfbrthfhyhrhyh")
      const response = await orderStore.historyOrder(props.order.id);
      infoHistoryOrder.value = response;
    });

    return { infoHistoryOrder };
  },
});
</script>
