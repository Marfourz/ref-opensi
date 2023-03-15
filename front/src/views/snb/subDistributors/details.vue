<template>
  <div class="">
    <router-link :to="{ name: 'subDistributors' }" path="sous-distributeurs">
      <BaseGoBack> </BaseGoBack>
    </router-link>
    <div class="flex justify-between mt-3">
      <div class="flex space-x-4">
        <div class="font-bold text-xl tracking-[-2%]">
          {{ selectedMaster?.organisation.socialReason }}
        </div>
        <BaseTableStatut :title="selectedMaster?.organisation.status"
          :type="selectedMaster?.organisation.status === 'active' ? 'success' : 'danger'"></BaseTableStatut>
      </div>
      <template v-if="selectedMaster && selectedMaster.organisation.status === 'active'">
        <BaseButton @click="disable" size="small" bgColor="danger">Désactiver</BaseButton>
      </template>
      <template v-else>
        <BaseButton @click="enable" size="small" bgColor="success">Activer</BaseButton>
      </template>
    </div>
    <BaseTabs :tabs="tabs" class="mt-7">
      <template #dashboard>
        <div class="font-bold text-xl tracking-[-2%] mt-7">Statistiques</div>
        <div class="grid grid-cols-4 space-x-6 mt-7">
          <DashboardCard :data="turnover"></DashboardCard>
          <DashboardCard :data="numberOfOrders"></DashboardCard>
          <DashboardCard :data="numberOfPartners"></DashboardCard>
          <DashboardCard :data="turnover"></DashboardCard>
        </div>
        <div>
          <div class="font-bold text-xl tracking-[-2%] mt-6">
            Évolution du chiffre d’affaire
          </div>
          <div class="w-full">
            <apexchart height="400px" type="line" :options="chartOptions" :series="series"></apexchart>
          </div>
        </div>
        <div>
          <div class="font-bold text-xl tracking-[-2%] mt-6">
            Performance des produits
          </div>
          <BaseTable :titles="titles" :data="selectedMaster?.productsInfos"> </BaseTable>
        </div>
      </template>
      <template #orders>
        <div class="mt-7">
          <BaseTitle title="Commandes"></BaseTitle>
          <VOrders />
        </div>
      </template>
      <template #distributors>
        <div class="mt-7">
          <BaseTitle title="Distributeurs agréés"></BaseTitle>
          <VOrganisation />
        </div>
      </template>
      <template #infos>
        <div class="font-bold text-xl tracking-[-2%] mb-8 mt-7">
          Informations générales
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="font-semibold text-base">Nom</span>
            <span class="font-medium text-sm">
              {{ selectedMaster?.organisation.socialReason }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-base">Numéro IFU</span>
            <span class="font-medium text-sm">
              {{ selectedMaster?.organisation.fiscalId }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-base">Téléphone</span>
            <span class="font-medium text-sm">
              {{ selectedMaster?.organisation.phone }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-base">Email</span>
            <span class="font-medium text-sm">
              {{ selectedMaster?.organisation.email }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-base">Représentant</span>
            <span class="font-medium text-sm">
              {{ selectedMaster?.organisation.ownerName }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-base">Adresse</span>
            <span class="font-medium text-sm">
              {{ selectedMaster?.organisation.adress }}
            </span>
          </div>
        </div>

        <!-- <BaseTextGroup :descriptions="demandeInfos"></BaseTextGroup> -->
      </template>
    </BaseTabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { useOrganizationStore } from "@/stores/organization";
import { InfoOrganisation } from "@/types/interfaces";
import { useRoute } from "vue-router";
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import VOrders from "@/components/VOrders.vue";
import VOrganisation from "@/components/VOrganisation.vue";
import BaseGoBack from "@/components/base/BaseGoBack.vue";

const chartOptions = ref({
  chart: {
    id: "vuechart-example",
  },
  colors: ["#259475"],
  xaxis: {
    categories: [
      "Jan",
      "Fev",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jui",
      "Aou",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
});

const series = ref([
  {
    name: "series-1",
    data: [
      "100k",
      "300k",
      "400k",
      "100k",
      "100k",
      "300k",
      "250k",
      "300k",
      "400k",
      "200k",
      "100k",
      "100k",
    ],
  },
]);

const tabs = [
  { value: "dashboard", libelle: "Tableau de board" },
  { value: "orders", libelle: "Commandes" },
  { value: "distributors", libelle: "Distributeurs agréés" },
  { value: "infos", libelle: "Informations générales" },
];

const titles = [
  {
    title: "",
    name: "image",
  },
  {
    title: "Produit",
    name: "Nom",
  },

  {
    title: "Nombre de casiers",
    name: "totalBulk",
  },

  {
    title: "Chiffre d’affaire",
    name: "turnover",
    transform: formatPrice,
  },
];

const organizationStore = useOrganizationStore();

const selectedMaster = ref<InfoOrganisation>();

const route = useRoute();
const id = ref("");
type State = {
  organisationId: string;
};
const state = reactive<State>({
  organisationId: "",
});

const turnover = computed(() => {
  return {
    title: `${selectedMaster.value?.organisation.wallet.turnover
      ? selectedMaster.value?.organisation.wallet.turnover
      : "0"
      } FCFA`,

    subtitle: "Chiffre d’affaire",

    icon: "dollar",
    primaryColor: "#0060CF",
    secondaryColor: "#E6EAF6",
  };
});

const numberOfOrders = computed(() => {
  return {
    title: `${selectedMaster.value?.orders ? selectedMaster.value?.orders : "0"
      } `,
    subtitle: "Nbre de commandes",

    icon: "Papers",
    primaryColor: "#B9212E",
    secondaryColor: "#FFEEED",
  };
});

const numberOfPartners = computed(() => {
  return {
    title: `${selectedMaster.value?.partners}`,
    subtitle: "Nbre de partenaires",

    icon: "dollar",
    primaryColor: "#0060CF",
    secondaryColor: "#E6EAF6",
  };
});

const ranking = computed(() => {
  return {
    title: `${selectedMaster.value} `,
    subtitle: "Nbre de partenaires",

    icon: "star",
    primaryColor: "#0060CF",
    secondaryColor: "#E6EAF6",
  };
});

function formatPrice(element: any) {
  if (element.wallet) return `${element.wallet.turnover} FCFA`;
  return `0 FCFA`;
}
onMounted(async () => {
  state.organisationId = route.params.id as string;
  console.log(id.value);
  try {
    if (state.organisationId) {
      const response = await organizationStore.onView(state.organisationId);
      selectedMaster.value = response;

      console.log(selectedMaster.value);
    }
  } catch (error) { }
});

const disable = async () => {

  try {
    if (selectedMaster.value && selectedMaster.value.organisation.id) {

      const response = await organizationStore.disable(state.organisationId);
      selectedMaster.value.organisation = { ...selectedMaster.value.organisation, ...response };
    }
  } catch (error) {
    console.log(error);

  }
}

const enable = async () => {

  try {
    if (selectedMaster.value && selectedMaster.value.organisation.id) {

      const response = await organizationStore.enable(state.organisationId);
      console.log(response);

      selectedMaster.value.organisation = { ...selectedMaster.value.organisation, ...response };
    }
  } catch (error) {
    console.log(error);

  }
}


</script>
