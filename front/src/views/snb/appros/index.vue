<template>
  <div class="">
    <PageInTwoPart>
      <template #firstPart>
        <div class="space-y-8">
          <div class="flex space-x-6 items-center">
            <BaseTitle title="Mes appros"></BaseTitle>
            <BaseButton icon="plus" size="small" @click="goToCreateAppros"
              >Nouvel appro</BaseButton
            >
          </div>
          <div class="relative">
            <BaseTableWithFilter
            :titles="titles"
            :requestId="organisationId"
            :fetchData="orderStore.fetchAllByOrganization"
            :actions="actions"
          >
            <template #status="{ element }">
              <BaseTableStatut
                :title="getStatutLabel(element)"
                :type="getStatutType(element)"
              ></BaseTableStatut>
            </template>

            <template #totalAmount="{ element }">
              <div>{{ helpers.currency(element.totalAmount) }} F</div>
            </template>
            <template #createdAt="{ element }">
              <div>
                {{ helpers.formatDateHour(element.createdAt) }}
              </div>
            </template>
            <template #filter>
          <div class="flex space-x-4 h-full">
            <!-- <div
              class="flex border rounded items-center justify-center px-4 font-semibold space-x-2"
            >
              <div>Filtré par</div>
              <BaseIcon name="simpleArrowBottom"></BaseIcon>
            </div> -->

            <BaseButton icon="upload" size="small">Télécharger</BaseButton>
           
          </div>
        </template>
          </BaseTableWithFilter>
          </div>
          
        </div>
      </template>
      <template #secondPart>
        <Order :order="order" v-if="order">
          <template #title>
            <div class="flex space-x-2  items-center">
              <div class="font-bold text-lg ">Appro {{ order.reference }} </div>
              <BaseTableStatut :title="getStatutLabel(order)" :type="getStatutType(order)"></BaseTableStatut>
            </div>
          </template>
        </Order>

        <div class="flex flex-col items-center space-y-4" v-else>
        <img src="@/assets/images/emptyBasket.png" alt="" />
        <div class="font-semibold text-center">
          Vous verrez ici les détails  d'une <br> commande
        </div>
      </div>
      </template>
    </PageInTwoPart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import PageInTwoPart from "../../../components/PageInTwoPart.vue";
import { useOrdersStore } from "@/stores/orders";
import Order from "@/components/Order.vue";
import { OrderStatus, OrganisationType } from "../../../types/enumerations";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../../stores/users";
import helpers from "@/helpers/index";
import { useToast } from "vue-toastification";

import EmptyState from "../../../components/EmptyState.vue";

export default defineComponent({
  components: { PageInTwoPart, Order,EmptyState },
  setup() {
    const titles = [
      {
        title: "Appro",
        name: "reference",
      },
      {
        title: "Date",
        name: "createdAt",
      },
      {
        title: "Total",
        name: "totalAmount",
      },
      {
        title: "Statut",
        name: "status",
      },
      {
        title: "Action",
        name: "action",
      },
    ];

    const order = ref();

    const orderStore = useOrdersStore();
    const userStore = useUsersStore();

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    const router = useRouter();
    function goToCreateAppros() {
      router.push({
        name: "approsCreate",
      });
    }

    function getStatutLabel(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "Accepté";
      else if (element.status == OrderStatus.DELIVERED) return "Inactive";
      else if (element.status == OrderStatus.NEW) return "Nouveau";
    }

    function getStatutType(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "colorize";
      else if (element.status == OrderStatus.DELIVERED) return "success";
      else if (element.status == OrderStatus.NEW) return "blue";
    }

    const toast = useToast()

    async function showItemOrder(element : any){
        try{
          const response = await orderStore.fetchOne(element.id)
          order.value = response
        }
        catch(error){
          toast.error("T")
        }
        
    }

    const actions = [
        {
          title: "Voir détail",
          icon: "eye",
          action: showItemOrder,
        },
     
    ];

    return {
      titles,
      goToCreateAppros,
      order,
      organisationId,
      orderStore,
      getStatutLabel,
      getStatutType,
      helpers,
      actions
    };
  },
});
</script>

<style scoped></style>
