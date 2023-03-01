<template>
  <div class="">
    <BaseTitle title="Tableau de bord"></BaseTitle>
    <!-- Statistiques -->
    <div class="flex justify-between items-center mt-9">
      <div class="">
        <BaseTitle title="Statistiques"></BaseTitle>
      </div>
      <div class="text-link underline cursor-pointer font-semibold">
        <div
          class="flex border rounded items-center justify-center px-4 font-semibold space-x-2"
        >
          <div>Ce mois</div>
          <BaseIcon name="Top"></BaseIcon>
        </div>
      </div>
    </div>
    <!-- DashboardCard -->
    <div class="grid grid-cols-3 space-x-6 mt-7">
      <DashboardCard :data="Turnover"></DashboardCard>
      <DashboardCard :data="numberOfOrders"></DashboardCard>
      <DashboardCard :data="NumberOfPartners"></DashboardCard>
    </div>

    <!--Évolution du chiffre d’affaire  -->
    <div class="mt-6">
      <BaseTitle title="Évolution du chiffre d’affaire"></BaseTitle>
    </div>
    <!--Chiffre d’affaire par produit  -->
    <div class="flex justify-between items-center mt-7">
      <div class="">
        <BaseTitle title="Chiffre d’affaire par produit"></BaseTitle>
      </div>
      <div class="text-link underline cursor-pointer font-semibold">
        <div
          class="flex border rounded items-center justify-center px-4 font-semibold space-x-2"
        >
          <div>Ce mois</div>
          <BaseIcon name="Top"></BaseIcon>
        </div>
      </div>
    </div>
    <BaseTable :titles="titles"></BaseTable>
    <!-- Performance des partenaires -->
    <div class="flex justify-between items-center mt-7">
      <div class="">
        <BaseTitle title="Performance des partenaires"></BaseTitle>
      </div>
      <div class="text-link underline cursor-pointer font-semibold">
        <div
          class="flex border rounded items-center justify-center px-4 font-semibold space-x-2"
        >
          <div>Ce mois</div>
          <BaseIcon name="Top"></BaseIcon>
        </div>
      </div>
    </div>

    <div class="flex justify-between space-x-6">
      <div class="border rounded-lg p-4  w-[33%]">
        <BaseTitle
          title="Top masters distributeurs "
          class="bg-grey-80 py-3 gap-4 px-3"
        ></BaseTitle>
        <BaseTable :titles="title" class="py-3"></BaseTable>
      </div>

      <div class="border rounded-lg p-4 w-[33%]">
        <BaseTitle
          title="Top distributeurs agréés"
          class="bg-grey-80 py-3 gap-4 px-4"
        ></BaseTitle>
        <BaseTable :titles="title" class="py-3"></BaseTable>
      </div>

      <div class="border rounded-lg p-4 w-[33%]">
        <BaseTitle
          title="Top dépôts"
          class="bg-grey-80 py-3 gap-4 px-4"
        ></BaseTitle>
        <BaseTable :titles="title" class="py-3"></BaseTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import DashboardCard from "@/components/DashboardCard.vue";
import helpers from "@/helpers/index";
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue";
import BaseTitleVue from "@/components/base/BaseTitle.vue";

export default defineComponent({
  components: { DashboardCard, BaseTableStatut, BaseTableWithFilter },

  setup() {
    const numberOfOrders = computed(() => {
      return {
        title: `${
          generalInfos.value
            ? helpers.currency(
                generalInfos.value.totalPackProducts._sum.currentQuantity
              )
            : 0
        } `,
        subtitle: "Nbre de commandes",

        icon: "Papers",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED",
      };
    });

    const Turnover = computed(() => {
      return {
        title: `${
          generalInfos.value
            ? helpers.currency(
                generalInfos.value.totalRackProducts._sum.currentQuantity
              )
            : 0
        } `,
        subtitle: "Chiffre d’affaire",

        icon: "dollar",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED",
      };
    });

    const NumberOfPartners = computed(() => {
      return {
        title: `${
          generalInfos.value
            ? helpers.currency(generalInfos.value.totalCost)
            : 0
        } FCFA`,
        subtitle: "Nbre de partenaires",

        icon: "dollar",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6",
      };
    });

    const titles = [
      {
        title: "Produit",
        name: "name",
      },

      {
        title: "Nombre de casiers",
        name: "nombre de casiers",
      },

      {
        title: "Chiffre d’affaire",
        name: "chiffre d’affaire",
      },
    ];

    const title = [
      {
        title: "",
        name: "index",
      },

      {
        title: "name",
        name: "name",
      },

      {
        title: "Chiffre d’affaire",
        name: "chiffre d’affaire",
      },
    ];

    const generalInfos = ref();

    return {
      numberOfOrders,
      Turnover,
      NumberOfPartners,
      titles,
      generalInfos,
      title,
    };
  },
});
</script>

<style scoped></style>
