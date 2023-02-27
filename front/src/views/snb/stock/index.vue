<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <BaseTitle title="Stock"></BaseTitle>
        <BaseButton icon="stock2" size="small">Évolution du stock</BaseButton>
      </div>
      <div
        class="text-link underline cursor-pointer font-semibold"
        @click="goToUpadateStock"
      >
        Gestion de stock
      </div>
    </div>
    
    <div class="grid grid-cols-4 space-x-4">
        <DashboardCard :data="rackStock"></DashboardCard>
        <DashboardCard :data="packStock"></DashboardCard>
        <DashboardCard :data="totalCost"></DashboardCard>
        <DashboardCard :data="approDate"></DashboardCard>
    </div>

   
    <ProductByCategory  :titles="titles" :actions="actions" :withoutFilter="true"></ProductByCategory>
  </div>
</template>

<script lang="ts">
import { defineComponent,computed,onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DashboardCard from "../../../components/DashboardCard.vue";
import { useProductCategoryStore } from "../../../stores/product-category";
import { IProduct } from "../../../types/interfaces";
import ProductByCategory from "../products/components/ProductByCategory.vue";
import helpers from "@/helpers/index.ts"
import { useProductStore } from "../../../stores/product";
import { useUsersStore } from "../../../stores/users";




export default defineComponent({
    components:{DashboardCard,ProductByCategory},
  setup() {
    
    const packStock = computed(()=>{
        return {
        title: `${generalInfos.value ? helpers.currency(generalInfos.value.totalPackProducts._sum.currentQuantity
) : 0} `,
        subtitle: "Pack en stock",
       
        icon: "bottle",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED"
    }
    }) 



    const rackStock = computed(()=>{
        return {
        title: `${generalInfos.value ? helpers.currency(generalInfos.value.totalRackProducts._sum.currentQuantity
) : 0} `,
        subtitle: "Casier en stock",
       
        icon: "bottle",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED"
    }
    }) 

    const totalCost = computed(()=>{
        return {
        title: `${generalInfos.value ? helpers.currency(generalInfos.value.totalCost) : 0} FCFA`,
        subtitle: "Coût total des produits",
       
        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6"
    }
    }) 

    const approDate = computed(()=>{
        return {
        title: `${generalInfos.value ? helpers.formatDate(generalInfos.value.lastStock.createdAt) : "Aucun"}`,
        subtitle: "Date du dernier appro",
       
        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6"
    }
    }) 

    const router = useRouter()

    const product = ref([])

    function goToUpadateStock(){
        router.push({name : "updateStock"})
    }

    const titles = [
      {
        title: "Identifiant",
        name: "image",
      },
      {
        title: "Nom du produit",
        name: "name",
      },

      {
        title: "Volume",
        name: "volume",
      },

      {
        title: "Quantité en stock",
        name: "stock",
        transform: getStock,
      },

      {
        title: "Prix/Casier",
        name: "bulkPrice",
        transform: formatPrice
        
      },
      {
        title: "Prix total",
        name: "totalPrice",
        transform : getTotalPrice
      }
    ];

    function getStock(element: IProduct) {
      if (element.stocks && element.stocks[0])
        return element.stocks[0].currentQuantity;
      else return 0;
    }


    function getTotalPrice(element : IProduct){
        let price = 0
        if (element.stocks && element.stocks[0])
            price = element.stocks[0].currentQuantity  * element.bulkPrice
        return helpers.currency(price)
    }

    function formatPrice(element : IProduct){
        return `${helpers.currency(element.bulkPrice)} F`  
    }

    const actions = [
      {
        title: "Voir détail",
        icon: "eye",
        action: onView,
      },
      {
        title: "Modifier",
        icon: "edit",
        action: onUpdate,
      },
      {
        title: "Supprimer",
        icon: "removeRed",
        action: onDelete,
      },
    ];

    function onView() {}
    function onUpdate() {}
    function onDelete() {}

    const generalInfos = ref()

    const productStore = useProductStore()

    const userStore = useUsersStore()

    const reload = ref(false)

    const organizationId = computed(()=>{
        return userStore.getCurrentUser?.organisationId
    })

    watch(()=>organizationId.value,(newValue)=>{
         loadStockGeneralInfo()
    })

    async function loadStockGeneralInfo(){
        const response = await productStore.stockGeneralInfo() 
       
        generalInfos.value = response
    }

    onMounted(async ()=>{
        loadStockGeneralInfo()
    })

    return {
        packStock,
        rackStock,
        totalCost,
        approDate,
        goToUpadateStock,
        titles,
        actions,
        organizationId,
        generalInfos,
        reload

    };
  },
});
</script>

<style scoped></style>
