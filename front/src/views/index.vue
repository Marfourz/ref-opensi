<template>
  <div class="">
    <BaseTitle title="Tableau de bord"></BaseTitle>
    <!-- Statistiques -->
    <div class="flex justify-between items-center mt-9">
      <div class="font-bold text-xl tracking-[-2%]">Statistiques</div>
      <BaseDateRange></BaseDateRange>
    </div>

    <!-- DashboardCard -->
    <div class="grid grid-cols-3 space-x-6 mt-7">
      <DashboardCard :data="turnover"></DashboardCard>
      <DashboardCard :data="numberOfOrders"></DashboardCard>
      <DashboardCard :data="numberOfPartners"></DashboardCard>
    </div>

    <div class="mt-6 font-bold text-xl tracking-[-2%]">
      Évolution du chiffre d’affaires
    </div>

    <div class="w-full">
      <apexchart
        height="400px"
        type="line"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>

    <div class="flex justify-between items-center mt-7">
      <div class="font-bold text-xl tracking-[-2%]">
        Chiffre d’affaires par produit
      </div>
      <BaseDateRange></BaseDateRange>
    </div>
    <BaseTable :titles="titles" :data="productsInfos">
      <template #image="{ element }">
        <div class="bg-grey-75 gap-2 p-1 rounded-lg">
          <img
            :src="`${
              element.images && element.images[0]
                ? element.images[0].url
                : '@/assets/images/beverage.png'
            }`"
            alt=""
          />
        </div>
      </template>
    </BaseTable>
    <!-- Performance des partenaires -->
    <div class="flex justify-between items-center mt-7">
      <div class="font-bold text-xl">Performance des partenaires</div>
      <BaseDateRange></BaseDateRange>
    </div>
    <!-- Array top parteners -->
    <div>
      <div class="grid grid-cols-3 gap-6 mt-7">
        <div
          class="border rounded-lg p-4"
          v-if="orgType === OrganisationType.SNB"
        >
          <div class="bg-grey-80 py-3 gap-4 px-3 font-bold text-base">
            Top masters distributeurs
          </div>

          <BaseTable :titles="title" :data="statPartners.md" class="py-3">
            <template #id="{ element }">
              <div>
                {{ element.index + 1 }}
              </div>
            </template>
            <template #wallet="{ element }">
              <div class="">{{ element.wallet.turnover }}FCFA</div>
            </template>
            <template #socialReason="{ element }">
              <div class="text-link">{{ element.socialReason }}</div>
            </template>
          </BaseTable>
        </div>

        <div
          class="border rounded-lg p-4"
          v-if="
            orgType === OrganisationType.SNB || orgType === OrganisationType.MD
          "
        >
          <div class="bg-grey-80 py-3 gap-4 px-3 font-bold text-base">
            Top distributeurs agréés
          </div>
          <BaseTable :titles="title" :data="statPartners.da" class="py-3"
            ><template #id="{ element }">
              <div>
                {{ element.index + 1 }}
              </div>
            </template>
            <template #wallet="{ element }">
              <div class="">{{ element.wallet.turnover }}FCFA</div>
            </template>
            <template #socialReason="{ element }">
              <div class="text-link">{{ element.socialReason }}</div>
            </template>
          </BaseTable>
        </div>

        <div class="border rounded-lg p-4">
          <div class="bg-grey-80 py-3 gap-4 px-3 font-bold text-base">
            Top dépôts
          </div>
          <div>

          </div>
          <BaseTable :titles="title" :data="statPartners.dp" class="py-3"
            ><template #id="{ element }">
              <div>
                {{ element.index + 1 }}
              </div>
            </template>
            <template #wallet="{ element }">
              <div class="">{{ element.wallet.turnover }}FCFA</div>
            </template>
            <template #socialReason="{ element }">
              <div class="text-link">{{ element.socialReason }}</div>
            </template>
          </BaseTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, reactive } from "vue";
import DashboardCard from "@/components/DashboardCard.vue";
import helpers from "@/helpers/index";
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue";
// import BaseTitleVue from "@/components/base/BaseTitle.vue";
import { useOrganizationStore } from "@/stores/organization";
import { OrganisationType } from "@/types/enumerations";
import { useUsersStore } from "@/stores/users";
export default defineComponent({
  components: { DashboardCard, BaseTableStatut, BaseTableWithFilter },

  setup() {
    const turnover = computed(() => {
      return {
        title: `${
          statInfos.value && statInfos.value.wallet
            ? helpers.currency(statInfos.value.wallet.turnover)
            : 0
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
          statInfos.value && statInfos.value.orders
            ? helpers.currency(statInfos.value.orders)
            : 0
        } `,
        subtitle: "Nombre de commandes",

        icon: "Papers",
        primaryColor: "#B9212E",
        secondaryColor: "#FFEEED",
      };
    });

    const numberOfPartners = computed(() => {
      return {
        title: `${
          statInfos.value && statInfos.value.partners
            ? helpers.currency(statInfos.value.partners)
            : 0
        } `,
        subtitle: "Nombre de partenaires",

        icon: "partners",
        primaryColor: "#0060CF",
        secondaryColor: "#E6EAF6",
      };
    });

    const productsInfos = computed(() => {
      return statInfos.value ? statInfos.value.productsInfos : [];
    });

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

    const title = [
      {
        title: "",
        name: "id",
      },

      {
        title: "Nom",
        name: "socialReason",
      },

      {
        title: "Chiffre d’affaires",
        name: "wallet.turnover",
        transform: formatPrice,
      },
    ];
    function formatPrice(element: any) {
      if (element.wallet) return `${element.wallet.turnover} FCFA`;
      return `0 FCFA`;
    }
    const generalInfos = ref();

    const organisationStore = useOrganizationStore();

    const statInfos = ref();

    const statPartners = reactive({
      md: [],
      dp: [],
      da: [],
    });

    const userStore = useUsersStore();

    const orgType = computed(() => {
      return userStore.getCurrentUser?.organisation?.type;
    });

    onMounted(async () => {
      try {
        const response = await organisationStore.statInfo();
        statInfos.value = response.data;
      } catch (error) {}

      try {
        const response = await organisationStore.statPartners(
          OrganisationType.MD
        );
        statPartners.md = response.data;
      } catch (error) {}
      try {
        const response = await organisationStore.statPartners(
          OrganisationType.DP
        );
        statPartners.dp = response.data;
      } catch (error) {}
      try {
        const response = await organisationStore.statPartners(
          OrganisationType.DA
        );
        statPartners.da = response.data;
      } catch (error) {}
    });

    const chartOptions = ref({
      tooltip:{
        marker: {
          show: false,
      },
        },
      chart: {
        toolbar: {
          show: false,
        },
        
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
        name: "Chiffre d’affaires",
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

    return {
      numberOfOrders,
      turnover,
      numberOfPartners,
      titles,
      generalInfos,
      title,
      statInfos,
      productsInfos,
      statPartners,
      orgType,
      OrganisationType,
      chartOptions,
      series,
    };
  },
});
</script>

<style scoped></style>
