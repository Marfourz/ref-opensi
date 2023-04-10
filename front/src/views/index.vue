<template>
  <div class="">
    <BaseTitle title="Tableau de bord"></BaseTitle>
    <!-- Statistiques -->
    <div class="flex justify-between items-center mt-9">
      <div class="font-bold text-xl tracking-[-2%]">Statistiques</div>
      <BaseDateRange @input="periodes.stat = $event"></BaseDateRange>
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
      <OrgnaisationTurnoverEvolution :organisationId="organisationId" />
    </div>

    <div class="flex justify-between items-center mt-7">
      <div class="font-bold text-xl tracking-[-2%]">
        Chiffre d’affaires par produit
      </div>
      <BaseDateRange></BaseDateRange>
    </div>
    <BaseTable :titles="titles" :data="productsInfos">
      <template #produit="{ element }">
        <div class="flex items-center space-x-2.5">
          <div
            class="bg-grey-75 flex items-center justify-center rounded-lg w-[50px] h-[50px]"
          >
              <img
            :src="`${
              element.images && element.images[0]
                ? element.images[0].url
                : '@/assets/images/beverage.png'
            }`"
            alt=""
          />  
           <!-- <template #image="{ element }">
              <div class="w-8 h-8">
                <img
                  :src="`${
                    element.image && element.image[0]
                      ? element.image[0].url
                      : '@/assets/images/beverage.png'
                  }`"
                  alt=""
                  class="max-h-10 max-w-10"
                />
              </div>
            </template> -->
          </div>
          <div>{{ element.product.name }}</div>
        </div>
      </template>

      <template #totalBulk="{ element }">
        <div>
          {{ element.currentQuantity ? element.currentQuantity : 0 }}
        </div>
      </template>
    </BaseTable>
    <!-- Performance des partenaires -->
    <div class="flex justify-between items-center mt-7">
      <div class="font-bold text-xl">Performance des partenaires</div>

      <BaseDateRange @input="periodes.topParteners = $event"></BaseDateRange>
    </div>
    <!-- Array top parteners -->
    <div>
      <div class="grid grid-cols-3 gap-6 mt-7">
        <div
          class="border rounded-lg p-4 min-h-[520px]"
          v-if="orgType === OrganisationType.SNB"
        >
          <div class="bg-grey-80 py-3 gap-4 px-3 font-bold text-base">
            Top masters distributeurs
          </div>
          <div
            v-if="statPartners.md.length == 0"
            class="h-full flex flex-col justify-center"
          >
            <EmptyState
              title="Vos top masters distributeurs <br> apparaîtront ici"
              image=""
              :textPosition="TextPosition.TOP"
            ></EmptyState>
          </div>

          <BaseTable
            :titles="title"
            :data="statPartners.md"
            class="py-3"
            v-else
          >
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
          class="border rounded-lg p-4 min-h-[520px]"
          v-if="
            orgType === OrganisationType.SNB || orgType === OrganisationType.MD
          "
        >
          <div class="bg-grey-80 py-3 gap-4 px-3 font-bold text-base">
            Top distributeurs agréés
          </div>
          <div
            v-if="statPartners.da.length == 0"
            class="h-full flex flex-col justify-center"
          >
            <EmptyState
              title="Vos top distributeurs agréés  <br> apparaîtront ici "
              image=""
              :textPosition="TextPosition.TOP"
            ></EmptyState>
          </div>

          <BaseTable :titles="title" :data="statPartners.da" class="py-3" v-else
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

        <div class="border rounded-lg p-4 min-h-[520px]">
          <div class="bg-grey-80 py-3 gap-4 px-3 font-bold text-base">
            Top dépôts
          </div>

          <div
            v-if="statPartners.dp.length == 0"
            class="h-full flex flex-col justify-center"
          >
            <EmptyState
              title="Vos top dépôts <br> apparaîtront ici"
              image=""
              :textPosition="TextPosition.TOP"
            ></EmptyState>
          </div>

          <BaseTable :titles="title" :data="statPartners.dp" class="py-3" v-else
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
import { defineComponent, computed, ref, onMounted, reactive, watch } from "vue";
import DashboardCard from "@/components/DashboardCard.vue";
import helpers from "@/helpers/index";
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue";
// import BaseTitleVue from "@/components/base/BaseTitle.vue";
import { useOrganizationStore } from "@/stores/organization";
import { OrganisationType } from "@/types/enumerations";
import { useUsersStore } from "@/stores/users";
import OrgnaisationTurnoverEvolution from "../components/OrgnaisationTurnoverEvolution.vue";
import EmptyState from "../components/EmptyState.vue";
import TextPosition from "@/components/EmptyState.vue"


export default defineComponent({
  components: { DashboardCard, BaseTableStatut, BaseTableWithFilter,OrgnaisationTurnoverEvolution, EmptyState },

  setup() {
    const turnover = computed(() => {
      return {
        title: `${
          statInfos.value && statInfos.value.turnover
            ? helpers.currency(statInfos.value.turnover)
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
        title: "Produit",
        name: "image",
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
 const image = ref<File>();


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

    const organisationId = computed(()=>{
      return userStore.getCurrentUser?.organisationId
    })


    watch(()=>organisationId.value,(newValue)=>{
      loadStat()
    })

    async function loadStat(){
      try {
        const response = await organisationStore.statInfo(organisationId.value as string,periodes.stat);
        statInfos.value = response.data;
      } catch (error) {}

    }

    const periodes = reactive({
      topParteners : {
        startDate : new Date(),
        endDate : new Date()
      },
      stat:{
        startDate : new Date(),
        endDate : new Date()
      }
    })

    async function loadTopParteners(){

      try {
        const response = await organisationStore.statPartners({
          type : OrganisationType.MD,
          startDate : periodes.topParteners.startDate,
          endDate : periodes.topParteners.endDate,
        }

        );
        statPartners.md = response.data;
      } catch (error) {}
      try {
        const response = await organisationStore.statPartners({
          type : OrganisationType.DA,
          startDate : periodes.topParteners.startDate,
          endDate : periodes.topParteners.endDate,
        }
        );
        statPartners.dp = response.data;
      } catch (error) {}
      try {
        const response = await organisationStore.statPartners({
          type : OrganisationType.DP,
          startDate : periodes.topParteners.startDate,
          endDate : periodes.topParteners.endDate,
        });
        statPartners.da = response.data;
      } catch (error) {}
    }


    watch(()=>periodes.topParteners , async (newValue)=>{

      await loadTopParteners()
    })

    watch(()=>periodes.stat , async (newValue)=>{
      await loadStat()
    })

    onMounted(async () => {
      await loadStat()
      await loadTopParteners()
    });



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
      organisationId,
      TextPosition,
      periodes
    };
  },
});
</script>

<style scoped></style>
