<template>
    <!-- <HistoryStock></HistoryStock> -->p
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import HistoryStock from "@/components/HistoryStock.vue";
export default defineComponent({
  components: { HistoryStock },

props: {
    // orderId: { type: String, required: true },
    // order: {
    //   required: true,
    //   type: Object as PropType<IOrder>,
    // },
  },
//
//
//   setup(props) {
//     const orderStore = useOrdersStore();
//     const infoHistoryOrder = ref<Array<IOrderHistory>>([]);

//     onMounted(async () => {
//       console.log("dvfvfgbfbrthfhyhrhyh");
//       const response = await orderStore.historyOrder(props.order.id);
//       infoHistoryOrder.value = response;
//     });

//     return { infoHistoryOrder };
//   },
//
//
});
</script>
