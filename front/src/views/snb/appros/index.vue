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
          </BaseTableWithFilter>
        </div>
      </template>
      <template #secondPart>
        <Order :order="order" v-if="order">
          <template #title>
            <div class="flex space-x-2 items-center">
              <div class="font-bold text-lg">Appro #56767 </div>
              <BaseTableStatut :title="getStatutLabel(order)" :type="getStatutType(order)"></BaseTableStatut>
            </div>
          </template>
        </Order>
        <div  class="flex h-full flex-col justify-center" v-else>
          <EmptyState
            title="Vous verrez ici les détails  d'une <br> commande"
            image="/src/assets/images/emptyBasket.png"
          ></EmptyState>
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
        name: "appro",
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

    // const order = {
    //     organisation : OrganisationType.SNB,
    //     items : [
    //         {
    //             id : 1,
    //             createdAt : new Date(),
    //             updatedAt : new Date(),
    //             product : {
    //                 name : "Chap 50 CL",
    //                 unitPrice : 1000,
    //                 rackPrice : 1000,
    //                 packPrice : 20000,
    //                 volume : 2000,
    //             },
    //             quantity : 10,
    //             price : 2000,
    //         },
    //         {
    //             product : {
    //                 name : "Chap Cola 50 CL",
    //                 unitPrice : 500,
    //                 rackPrice : 1000,
    //                 packPrice : 20000,
    //                 volume : 200,
    //             },
    //             quantity : 220,
    //             price : 200,
    //         }
    //     ],
    //     totalAmount : 1000000,
    //     transaction : {

    //     },
    //     status :OrderStatus.DELIVERY,
    //     deliveryDate : Date
    // }

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

    async function showItemOrder(element : Order){
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
