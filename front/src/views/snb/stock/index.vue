<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      <div class="flex items-center space-x-6">
        <BaseTitle title="Stock"></BaseTitle>
       
      </div>

      <div class="flex md:space-x-9 space-x-4  items-center">
        <div class="text-link underline cursor-pointer font-semibold">
        <router-link :to="{ name: 'evolutionStock' }">
          Évolution du stock
        </router-link>
       
      </div>
      <div class="text-link underline cursor-pointer font-semibold" @click="goToUpadateStock" v-if="isSnb">
        Gestion de stock
      </div>
      </div>

      
     
    </div>

    <div class="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1  gap-4">
      <DashboardCard :data="rackStock"></DashboardCard>
      <DashboardCard :data="packStock"></DashboardCard>
      <DashboardCard :data="totalCost"></DashboardCard>
      <DashboardCard :data="approDate"></DashboardCard>
    </div>


    <ProductByCategory :titles="titles" :mobileTitles="mobileTitles" :actions="actions" :withoutFilter="true"></ProductByCategory>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DashboardCard from "../../../components/DashboardCard.vue";
import { useProductCategoryStore } from "../../../stores/product-category";
import { IProduct } from "../../../types/interfaces";
import ProductByCategory from "../products/components/ProductByCategory.vue";
import helpers from "@/helpers/index";
import { useProductStore } from "../../../stores/product";
import { useUsersStore } from "../../../stores/users";
import { OrganisationType } from "../../../types/enumerations";

export default defineComponent({
  components: { DashboardCard, ProductByCategory },
  setup() {

    const packStock = computed(() => {
      return {
        title: `${generalInfos.value ? helpers.currency(generalInfos.value.totalPackProducts._sum.currentQuantity
        ) : 0} `,
        subtitle: "Packs en stock",

        icon: "packlocker",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED"
      }
    })



    const rackStock = computed(() => {
      return {
        title: `${generalInfos.value ? helpers.currency(generalInfos.value.totalRackProducts._sum.currentQuantity
        ) : 0} `,
        subtitle: "Casiers en stock",

        icon: "bottleColors",
        primaryColor: "#B9212E",
        secondaryColor: "#F1EDFF"
      }
    })

    const totalCost = computed(() => {
      return {
        title: `${generalInfos.value && generalInfos.value.totalCost ? helpers.currency(generalInfos.value.totalCost) : 0} FCFA`,
        subtitle: "Coût total des produits",
        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6"
      }
    })

    const approDate = computed(() => {
      return {
        title: `${generalInfos.value && generalInfos.value.lastStock?.createdAt ? helpers.formatDate(generalInfos.value.lastStock.createdAt) : "Aucun"}`,
        subtitle: "Date du dernier appro",

        icon: "calend",
        primaryColor: "#0060CF",
        secondaryColor: "#FFE6CE"
      }
    })


    const router = useRouter();

    const product = ref([]);

    function goToUpadateStock() {
      router.push({ name: "updateStock" })
    }

    const titles = [
      {
        title: "Identifiant",
        name: "image",
      },
      {
        title: "Nom du produit",
        name: "product.name"
      },

      {
        title: "Volume",
        name: "volume",
      },

      {
        title: "Quantité en stock",
        name: "currentQuantity",
      },

      {
        title: "Prix/Casier",
        name: "product.bulkPrice",
        transform: formatPrice

      },
      {
        title: "Prix total",
        name: "totalPrice",
        transform: getTotalPrice
      }
    ];

    const mobileTitles = [
    {
        title: "Identifiant",
        name: "image",
      },
      {
        title: "Nom du produit",
        name: "product.name",
      }
    ]



   

    function getTotalPrice(element: any) {
      let price = 0
      price = element.currentQuantity * element.product.bulkPrice
      return `${helpers.currency(price)} F`
    }

    function formatPrice(element: any) {
      return `${helpers.currency(element.product.bulkPrice)} F`
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

    function onView() { }
    function onUpdate() { }
    function onDelete() { }

    const generalInfos = ref();

    const productStore = useProductStore();

    const userStore = useUsersStore();

    const reload = ref(false);

    const organizationId = computed(() => {
      return userStore.getCurrentUser?.organisationId
    })

    watch(() => organizationId.value, (newValue) => {
      loadStockGeneralInfo()
    })

    async function loadStockGeneralInfo() {
      const response = await productStore.stockGeneralInfo()

      generalInfos.value = response
    }

    const isSnb = computed(()=>{
      if(userStore.getCurrentUser?.organisation && userStore.getCurrentUser?.organisation.type == OrganisationType.SNB)
        return true
      return false
    })

    onMounted(async () => {
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
      reload,
      isSnb,
      mobileTitles

    };
  },
});
</script>

<style scoped></style>
