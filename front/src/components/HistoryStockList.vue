<template>
  <div class="space-y-4 mt-4">
    <HistoryStock
      v-for="history in infoHistorystock"
      :type="history.type"
      :date="history.date"
      :key="history.type"
      :amount="history.total"
      :casier="history.quantity"
      :packaging="history.packagingType"
    ></HistoryStock>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import HistoryStock from "@/components/HistoryStock.vue";
import { IStockHistory } from "@/types/interfaces";
import { useProductStore } from "@/stores/product";
import { useUsersStore } from "@/stores/users";
import { StockState } from "@/types/enumerations";

export default defineComponent({
  components: { HistoryStock },

  props: {
    type: {
      required: true,
      type: String as PropType<StockState>,
    },
  },
  setup(props) {
    const stockStore = useProductStore();
    const infoHistorystock = ref<IStockHistory[]>([]);
    const userStore = useUsersStore();
    const productStore = useProductStore();
    const generalInfos = ref();

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    watch(
      () => props.type,
      (newValue) => {
        loadHistoryStock();
      }
    );

    watch(organisationId, (newValue) => {
      loadHistoryStock();
    });
    async function loadHistoryStock() {
      const response = await stockStore.historyStock(
        organisationId.value,
        props.type
      );
      infoHistorystock.value = response;
      console.log("hello", response);
    }
    onMounted(async () => {
      loadHistoryStock();
    });
    return {
      infoHistorystock,
      loadHistoryStock,
    };
  },
});
</script>
