<template>
  <div class="">
    <router-link :to="{ name: 'stock' }" path="stock">
      <BaseGoBack> </BaseGoBack>
    </router-link>
    <div class="space-y-6 mt-3">
      <div class="">
        <BaseTitle title="Évolution du stock"></BaseTitle>
        <!-- Panel -->
        <div class="flex mt-8 space-x-4">
          <div v-for="(etat, index) in etats" :key="index">
            <VPanel
              :labels="etat.name"
              @click="activeTab = etat.value"
              :class="{
                'text-white bg-primary': etat.value === activeTab,
              }"
            />
          </div>
        </div>
      </div>
     
      <div class="">
        <HIstoryStockList :type="activeTab"></HIstoryStockList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StockState } from "@/types/enumerations";
import { ref } from "vue";
import HIstoryStockList from "@/components/HistoryStockList.vue";

import type { Ref } from "vue";

const etats: { name: string; value: StockState }[] = [
  {
    name: "Tout",
    value: StockState.ALL,
  },
  {
    name: "Approvisionnement",
    value: StockState.SUPPLY,
  },
  {
    name: "Vente",
    value: StockState.SALE,
  },
];

const activeTab: Ref<StockState> = ref(StockState.ALL);
</script>
<style scoped></style>
