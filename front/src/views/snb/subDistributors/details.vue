<template>
  <div class="">
    <router-link :to="{ name: 'subDistributors' }" path="sous-distributeurs">
      <!-- <BaseButton icon="ArrowLeft" size="small"></BaseButton> -->
      <BaseGoBack> </BaseGoBack>
    </router-link>
    <div class="flex justify-between mt-3">
      <div class="flex space-x-4">
        <div class="font-bold text-xl tracking-[-2%]">
          {{ selectedMaster?.organisation.socialReason }}
        </div>
        <BaseTableStatut
          :title="selectedMaster?.organisation.status"
        ></BaseTableStatut>
      </div>
      <BaseButton size="small" bgColor="danger">Désactivé</BaseButton>
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
            Évolution du chiffre d’affaires
          </div>
        </div>
        <div>
          <div class="font-bold text-xl tracking-[-2%] mt-6">
            Performance des produits
          </div>
          <BaseTable :titles="titles"> </BaseTable>
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
          <BaseTitle title="Distributeurs agréés"></BaseTitle><VOrganisation />
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

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useOrganizationStore } from "@/stores/organization";
import { InfoOrganisation } from "@/types/interfaces";
import { useRoute } from "vue-router";
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import VOrders from "@/components/VOrders.vue";
import VOrganisation from "@/components/VOrganisation.vue";
import BaseGoBack from "@/components/base/BaseGoBack.vue";
import BaseTextGroup from "@/components/base/BaseTextGroup.vue";

export default defineComponent({
  components: {
    BaseTableStatut,
    DashboardCard,
    VOrders,
    VOrganisation,
    BaseGoBack,
    BaseTextGroup,
  },
  setup() {
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

    onMounted(async () => {
      state.organisationId = route.params.id as string;
      console.log(id.value);
      try {
        if (state.organisationId) {
          const response = await organizationStore.onView(state.organisationId);
          selectedMaster.value = response;

          console.log(selectedMaster.value);
        }
      } catch (error) {}
    });

    const turnover = computed(() => {
      return {
        title: `${
          selectedMaster.value?.organisation.wallet.turnover
            ? selectedMaster.value?.organisation.wallet.turnover
            : "0"
        } FCFA`,

        subtitle: "Chiffre d’affaires",

        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6",
      };
    });

    const numberOfOrders = computed(() => {
      return {
        title: `${
          selectedMaster.value?.orders ? selectedMaster.value?.orders : "0"
        } `,
        subtitle: "Nbre de commandes",

        icon: "Papers",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED",
      };
    });

    const numberOfPartners = computed(() => {
      return {
        title: `${
          selectedMaster.value?.partners ? selectedMaster.value?.partners : "0"
        } `,
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

    const tabs = [
      { name: "dashboard", libelle: "Tableau de board" },
      { name: "orders", libelle: "Commandes" },
      { name: "distributors", libelle: "Distributeurs agréés" },
      { name: "infos", libelle: "Informations générales" },
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
        title: "Chiffre d’affaires",
        name: "turnover",
        transform: formatPrice,
      },
    ];

    function formatPrice(element: any) {
      if (element.wallet) return `${element.wallet.turnover} FCFA`;
      return `0 FCFA`;
    }

    // const demandeInfos = [
    //   {
    //     label: "Nom",
    //     value: selectedMaster?.organisation.socialReason,
    //   },
    //   {
    //     label: "Numéro IFU",
    //     value: selectedMaster?.organisation.fiscalId,
    //   },
    //   {
    //     label: "Téléphone",
    //     value: selectedMaster?.organisation.phone,
    //   },
    //   {
    //     label: "Email",
    //     value: selectedMaster?.organisation.email,
    //   },
    //   {
    //     label: "Représentant",
    //     value: selectedMaster?.organisation.ownerName,
    //   },
    //   {
    //     label: "Adresse",
    //     value: selectedMaster?.organisation.adress,
    //   },
    // ];
    return {
      id,
      state,
      selectedMaster,
      organizationStore,
      turnover,
      numberOfOrders,
      numberOfPartners,
      ranking,
      titles,
      tabs,
      formatPrice,
      // demandeInfos,
    };
  },
});
</script>
