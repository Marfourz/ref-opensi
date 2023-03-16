<template>
  <div class="">

    <BaseModal :title="modal.title" :show="modal.show" @close="modal.show = false">
      <template #modal>
        <div class="flex flex-col space-y-6 items-center py-4" v-if="modal.type == 'delete'">
          <BaseIcon name="warning"></BaseIcon>
          <div class="text-center font-semibold text-2xl" v-html="modal.title"></div>
          <div class="flex items-center space-x-2 w-full">
            <BaseButton bgColor="danger" :outline="true" class="w-1/2" @click="modal.show = false">
              Annuler
            </BaseButton>
            <BaseButton bgColor="danger" :loading="loading" class="w-1/2 bg-danger" @click="confirmResetOrder">
              Supprimer
            </BaseButton>
          </div>
        </div>
      </template>



    </BaseModal>


    <PageInTwoPart>
      <template #firstPart>
        <div class="space-y-8 ">
          <div class="flex space-x-6 items-center">
            <BaseTitle title="Mes appros"></BaseTitle>
            <BaseButton icon="plus" size="small" @click="goToCreateAppros">Nouvel appro</BaseButton>
          </div>
          <div class="relative">
            <BaseTableWithFilter
              :titles="titles"
              :requestId="organisationId"
              :fetchData="orderStore.fetchAllByOrganization"
              :filterActions="filterActions"
              @itemClick="showItemOrder"
            >
              <template #status="{ element }">
                <BaseTableStatut :title="getStatutLabel(element)" :type="getStatutType(element)"></BaseTableStatut>
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
        <Order :order="order" v-if="order" :key="reload">
          <template #title>

            <div class="space-y-4">
              <div class="flex space-x-2 items-center">
              <div class="font-bold text-lg">Appro {{ order.reference }}</div>
              <BaseTableStatut :title="getStatutLabel(order)" :type="getStatutType(order)"></BaseTableStatut>
            </div>

          
              <div class="font-bold text-sm flex justify-between border-success border-2 py-2.5 px-2 bg-[#E9F9EF] rounded" v-if=" order.deliveryMan && order.deliveryCode">
                <div>Code de livraison : {{ order.deliveryCode }}</div>
                <BaseIcon name="interrogation"/>
                
              </div>

              <div class="bg-[#FFEEED] flex  px-4 justify-center py-2 text-sm rounded" v-if="order.deliveryMan || order.deliveryDate">
                <div class="space-y-1">
                  <div class="semi-bold">Livraison</div>
                  <div class="flex items-center w-full">
                    <div class="flex items-center space-x-1.5" >
                      <BaseIcon name="date" class="w-4 h-4 text-[#6B7A99]"></BaseIcon>
                      <span>Date</span>
                      <span class="font-bold">{{!order.deliveryDate ? "Non défini" : helpers.formatDateReduce(order.deliveryDate) }}</span>
                    </div>
                    <div class="h-6 bg-[#D9D9D9] w-[1px] mx-1"></div>
                    <div class="flex items-center space-x-1.5" >
                      <BaseIcon name="user" class="w-4 h-4 text-[#6B7A99]"></BaseIcon>
                      <span>Livreur : </span>
                      <span class="text-[#0050CF] font-semibold underline cursor-pointer"
                        >{{order.deliveryMan}}</span
                      >
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>

            
          </template>
        </Order>

        <div class="flex flex-col items-center space-y-4" v-else>
          <img src="@/assets/images/emptyBasket.png" alt="" />
          <div class="font-semibold text-center">
            Vous verrez ici les détails d'une <br />
            commande
          </div>
        </div>
      </template>
    </PageInTwoPart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import PageInTwoPart from "../../../components/PageInTwoPart.vue";
import { useOrdersStore } from "@/stores/orders";
import Order from "@/components/Order.vue";
import { OrderStatus, OrganisationType } from "../../../types/enumerations";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../../stores/users";
import helpers from "@/helpers/index";
import { useToast } from "vue-toastification";

import EmptyState from "../../../components/EmptyState.vue";
import { IOrder } from "../../../types/interfaces";
import { useBasketStore } from "../../../stores/basket";

export default defineComponent({
  components: { PageInTwoPart, Order, EmptyState },
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

    const loading = ref(false)

    const orderStore = useOrdersStore();
    const userStore = useUsersStore();

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    const router = useRouter();
    function goToCreateAppros() {
      basketStore.clearBasket();
      router.push({
        name: "approsCreate",
      });
    }

    function getStatutLabel(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "Accepté";
      else if (element.status == OrderStatus.DELIVERED) return "Inactive";
      else if (element.status == OrderStatus.NEW) return "Nouveau";
      else if (element.status == OrderStatus.REJECTED) return "Rejetée";
    }

    function getStatutType(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "colorize";
      else if (element.status == OrderStatus.DELIVERED) return "success";
      else if (element.status == OrderStatus.NEW) return "blue";
      else if (element.status == OrderStatus.REJECTED) return "danger";
    }

    const toast = useToast();

    async function showItemOrder(element : any){
        try{
          const response = await orderStore.fetchOne(element.id)
          order.value = response
        }
        catch(error){
          toast.error("Suppression impossible")
        }
        
    }

    const modal = reactive({
      title: "",
      type: "create" as "create" | "delete" | "update",
      show: false

    });


   
    function filterActions(element : IOrder){
      let elements = []

      if(element.status == OrderStatus.NEW)
        elements =   [
      {
          title: "Modifier",
          iconClass:"text-tableColor",
          icon: "edit",
          action: showItemOrder,
        },
        {
          title: "Dupliquer",
          classIcon:"text-tableColor",
          icon: "duplicate",
          action: duplicateOrder,
        },
        {
          title: "Annuler",
          iconClass:"text-[#E03A15] w-3 h-3",
          titleClass: "text-[#E03A15] ",
          icon: "close",
          action: resetOrder,
        },
     
    ]

    else 
        elements = [
        {
          title: "Dupliquer",
          classIcon:"text-tableColor",
          icon: "duplicate",
          action: duplicateOrder,
        },
        ]
      return  elements
    }

    const reload = ref(0)

    const selectedOrder = ref<IOrder | null>(null)

    function resetOrder(value: IOrder) {
      modal.title = `Êtes-vous sûr de vouloir <br> annuler cette commande  ?`;
      modal.show = true;
      modal.type = "delete";
      selectedOrder.value = value
      reload.value = reload.value + 1
    }

    async function confirmResetOrder() {

      loading.value = true
      try {
        const response = await orderStore.delete(selectedOrder.value?.id as string)
        loading.value = false
      }
      catch (error) {
        loading.value = false
        modal.show = false
        toast.error("Suppression impossible")
      }
    }


    const basketStore = useBasketStore()

    async function duplicateOrder(value: IOrder) {
      console.log("duplicate",);
      const order = await orderStore.fetchOne(value.id)
      basketStore.createBasketWithOrder(order)
      router.push({ name: 'approsCreate' })
    }


   

    return {
      titles,
      goToCreateAppros,
      order,
      organisationId,
      orderStore,
      getStatutLabel,
      getStatutType,
      helpers,
      filterActions,
      resetOrder,
      modal,
      loading,
      confirmResetOrder,
      reload,
      showItemOrder
    };
  },
});
</script>

<style scoped></style>
