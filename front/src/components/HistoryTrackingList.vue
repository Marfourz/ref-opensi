<template>
  <div class="py-8 px-6">
    <div class="flex justify-between items-center mb-8">
      <div class="text-2xl font-semibold">Historique</div>
      <BaseIcon name="close" class="w-5 h-5 cursor-pointer" @click="$emit('close')"></BaseIcon>
    </div>
    <div class="flex mt-8">
      <div class="font-semibold text-base">Commande</div>
      <!-- <BaseTableStatut :title="order.status" class="ml-2"></BaseTableStatut>  -->
    </div>
    <div class="mt-4">
      <history-tracking
        type="created"
        :date="order_created.date"
        v-if="order_created"
      ></history-tracking>
    </div>
    <div class="mt-4">
      <history-tracking
        type="validated"
        :date="order_accepted.date"
        v-if="order_accepted"
      ></history-tracking>
    </div>
    <div class="mt-4">
      <history-tracking
        type="submitted"
        :date="order_delivered.date"
        v-if="order_delivered"
      ></history-tracking>
    </div>
    <!-- <div class="mt-4"><history-tracking :type="validated" :date="order.updatedAt"></history-tracking></div>  -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import HistoryTracking from "@/components/HistoryTracking.vue";
import { IOrderHistory } from "@/types/interfaces";
import { IOrder } from "@/types/interfaces";
import { useOrdersStore } from "@/stores/orders";

export default defineComponent({
  components: { HistoryTracking },

  props: {
    order_created: Object as PropType<IOrderHistory>,
    order_accepted: Object as PropType<IOrderHistory>,
    order_delivered: Object as PropType<IOrderHistory>,
    orderId: { type: String},
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
