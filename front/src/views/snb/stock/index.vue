<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <BaseTitle title="Stock"></BaseTitle>
        <BaseButton icon="stock2" size="small">Évolution du stock</BaseButton>
      </div>
      <div
        class="text-link underline cursor-pointer font-semibold"
      >
        Gestion de stock
      </div>
    </div>

    <div class="grid grid-cols-3 space-x-4">
        <DashboardCard :data="stockProduct"></DashboardCard>
        <DashboardCard :data="totalCost"></DashboardCard>
        <DashboardCard :data="approDate"></DashboardCard>
    </div>

    <ProductByCategory :withoutFilter="true"></ProductByCategory>
  </div>
</template>

<script lang="ts">
import { defineComponent,computed,onMounted } from "vue";
import DashboardCard from "../../../components/DashboardCard.vue";
import { useProductCategoryStore } from "../../../stores/product-category";
import ProductByCategory from "../products/components/ProductByCategory.vue";



export default defineComponent({
    components:{DashboardCard,ProductByCategory},
  setup() {
    const stockProduct = computed(()=>{
        return {
        title: "230 456 Casiers",
        subtitle: "Produits en stockage",
       
        icon: "bottle",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED"
    }
    }) 

    const totalCost = computed(()=>{
        return {
        title: "1 567 230 000 FCFA",
        subtitle: "Coût total des produits en stockage",
       
        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6"
    }
    }) 

    const approDate = computed(()=>{
        return {
        title: "1 567 230 000 FCFA",
        subtitle: "22/04/2022",
       
        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6"
    }
    }) 

    




    return {
        stockProduct,
        totalCost,
        approDate
    };
  },
});
</script>

<style scoped></style>
