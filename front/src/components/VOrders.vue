<template>
  <div class="border border-t-2  h-full" :key="reload">
    <div
      class="absolute top-6 right-0 left-0 flex justify-center"
      v-if="showSuccesInfo"
    >
      <SuccessInfo
        title="Livreur assigné avec succès"
        class="w-fit"
        @close="showSuccesInfo = false"
      ></SuccessInfo>
    </div>

    <BaseModal
      :show="show"
      @close="show = false"
      :title="!justAssign ? 'Accepter la commande' : 'Assigner à un livreur'"
    >
      <FormAssignDeliveryPerson
        :orderId="selectedOrderId"
        :justAssign="justAssign"
        @submitSuccess="orderAcceptSuccessful"
        @reset="show = false"
      ></FormAssignDeliveryPerson>
    </BaseModal>

    <BaseModal
      title="Rejeter une demande"
      :show="showReject"
      @close="showReject = false"
    >
      <template #modal>
        <div class="flex flex-col space-y-6 items-center py-4">
          <BaseIcon name="warning"></BaseIcon>
          <div class="text-center font-semibold text-2xl">
            Êtes vous sur de vouloir rejeter cette commande ?
          </div>
          <div class="flex items-center space-x-2 w-full">
            <BaseButton
              bgColor="danger"
              :outline="true"
              class="w-1/2"
              @click="showReject = false"
            >
              Annuler
            </BaseButton>
            <BaseButton
              bgColor="danger"
              :loading="loading"
              class="w-1/2 bg-danger"
              @click="confirmRejectOrder"
            >
              Rejeter
            </BaseButton>
          </div>
        </div>
      </template>
    </BaseModal> 

    <PageInTwoPart class="py-0" firstPartClass="pt-0 pl-0">
      <template #firstPart>
        <div class="space-y-8">
          
          <div class="relative">
            <BaseTableWithFilter
              :titles="titles"
              :requestId="organisationId"
              :fetchData="orderStore.fetchAllByOrganization"
              :filterActions="filterActions"
              @itemClick="showItemOrder"
              @onFetch="onFetch"
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
                  <BaseButton icon="upload" size="small"
                    >Télécharger</BaseButton
                  >
                </div>
              </template>
            </BaseTableWithFilter>
          </div>
        </div>
      </template>
      <template #secondPart>
        <Order :order="order" v-if="order">
          <template #title>
            <div class="space-y-4">
          
              <div class="flex space-x-2 items-center">
                <div class="font-bold text-lg">
                  Commande {{ order.reference }}
                </div>
                <BaseTableStatut
                  :title="getStatutLabel(order)"
                  :type="getStatutType(order)"
                ></BaseTableStatut>
              </div>

              <div
                class="bg-[#FFEEED] flex px-4 justify-center py-2 text-sm rounded"
                v-if="order.deliveryMan || order.deliveryDate"
              >
                <div class="space-y-1">
                  <div class="semi-bold">Livraison</div>
                  <div class="flex items-center w-full">
                    <div class="flex items-center space-x-1.5">
                      <BaseIcon
                        name="date"
                        class="w-4 h-4 text-[#6B7A99]"
                      ></BaseIcon>
                      <span>Date</span>
                      <span class="font-bold">{{
                        !order.deliveryDate
                          ? "Non défini"
                          : helpers.formatDateReduce(order.deliveryDate)
                      }}</span>
                    </div>
                    <div class="h-6 bg-[#D9D9D9] w-[1px] mx-1"></div>
                    <div class="flex items-center space-x-1.5">
                      <BaseIcon
                        name="user"
                        class="w-4 h-4 text-[#6B7A99]"
                      ></BaseIcon>
                      <span>Livreur : </span>
                      <a
                        class="text-[#0050CF] font-semibold underline cursor-pointer"
                        @click="goToViewDeliveryMan(order.deliveryMan.id)"
                        >{{ order.deliveryMan.name }} {{ order.deliveryMan.firstName }}</a
                      >
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Order>
        <div
          class="flex flex-col items-center space-y-4 h-full justify-center"
          v-else
        >
          <img src="@/assets/images/emptyBasket.png" alt="" />
          <div class="font-semibold text-center">
            Vous verrez ici les détails d'une <br  class="hidden md:block"/>
            commande
          </div>
        </div>
      </template>
    </PageInTwoPart>
    <BaseRightModal :show="showModal" v-if="showModal">
      <HistoryTrackingList :orderId="selectedOrderId" @close="showModal = false"></HistoryTrackingList>
    </BaseRightModal>

   

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from "vue";
import PageInTwoPart from "@/components/PageInTwoPart.vue";
import { useOrdersStore } from "@/stores/orders";
import Order from "@/components/Order.vue";
import { OrderStatus, OrganisationType } from "@/types/enumerations";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/stores/users";
import helpers from "@/helpers/index";
import { useToast } from "vue-toastification";
import EmptyState from "@/components/EmptyState.vue";

import FormAssignDeliveryPerson from "@/views/snb/orderReceived/components/FormAssignDeliveryPerson.vue";

import SuccessInfo from "@/components/SuccessInfo.vue";
import { IOrder } from "@/types/interfaces";
import BaseRightModal from "@/components/base/BaseRightModal.vue";
export default defineComponent({
  components: {
    PageInTwoPart,
    Order,
    EmptyState,
    FormAssignDeliveryPerson,
    SuccessInfo,
    BaseRightModal,
  },
  props:{
    organisationId:{
      type : String
    }
  },
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
    const infoHistoryOrder = ref();

    const justAssign = ref(false);

    const orderStore = useOrdersStore();
    const userStore = useUsersStore();

 

    const router = useRouter();
    function goToCreateAppros() {
      router.push({
        name: "approsCreate",
      });
    }

    function getStatutLabel(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "Accepté";
      else if (element.status == OrderStatus.DELIVERED) return "Livré";
      else if (element.status == OrderStatus.NEW) return "Nouveau";
      else if (element.status == OrderStatus.INPROGRESS) return "En cours";

      else if (element.status == OrderStatus.REJECTED) return "Rejetée";
    }

    function getStatutType(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "colorize";
      else if (element.status == OrderStatus.DELIVERED) return "success";
      else if (element.status == OrderStatus.NEW) return "blue";
      else if (element.status == OrderStatus.REJECTED) return "danger";
      else if (element.status == OrderStatus.INPROGRESS) return "colorize";
    }

    const toast = useToast();

    const partenaireTitle = computed(() => {
      if (order.value.organisation.type == OrganisationType.DA)
        return "Distributeur agrée";
      else return "Master distributeur";
    });

    const actions = [
      {
        title: "Voir détails",
        icon: "eye",
        action: showItemOrder,
      },
      {
        title: "Accepter",
        icon: "edit",
        action: acceptOrder,
      },
    ];

    function filterActions(element: IOrder) {
      let elements = [];

      if (element.status == OrderStatus.NEW)
        elements = [
          {
            title: "Accepter",
            classIcon: "text-tableColor",
            icon: "edit",
            action: acceptOrder,
          },
          {
            title: "Rejeter",
            iconClass: "text-[#E03A15] w-3 h-3",
           // titleClass: "text-[#E03A15] ",
            icon: "close",
            action: rejectOrder,
          },
        ];
        else if (element.status == OrderStatus.ACCEPTED || element.status == OrderStatus.INPROGRESS || element.status == OrderStatus.DELIVERED) {
        if (!element.deliveryMan) {
          elements.push({
            title: "Assigner à un livreur",
            classIcon: "text-tableColor",
            icon: "deliveryPerson",
            action: assignOrder,
          });
        }

        elements.push({
          title: "Voir facture proforma",
          classIcon: "text-tableColor",
          icon: "facture",
          action: viewInvoice,
        });

        elements.push({
          title: "Voir l'historique",
          classIcon: "text-tableColor",
          icon: "history",
          action: showHistoric,
        });
      }

      return elements;
    }
    const selectedOrderId = ref();

    const showModal = ref(false);

    function showHistoric(value : IOrder) {
      showModal.value = true;
      selectedOrderId.value = value.id
    }

    async function viewInvoice(order: IOrder) {
      const response = await orderStore.generateInvoice(order.id)
      router.push({
        name: "pdfViewer",
        params: {
          link: encodeURIComponent(response.url as string),
        },
      });
    }

    async function assignOrder(order: any) {
      
      show.value = true;
      justAssign.value = true;
      selectedOrderId.value = order.id;
    }

    async function acceptOrder(order: any) {
      show.value = true;
      justAssign.value = false;
      selectedOrderId.value = order.id;
    }

    async function rejectOrder(order: any) {
      showReject.value = true;
      selectedOrderId.value = order.id;
    }

    async function showItemOrder(element: any) {
      try {
        const response = await orderStore.fetchOne(element.id);
        order.value = response;
      } catch (error) {
       
      }
    }
   
  

    const reload = ref(1);

    function orderAcceptSuccessful() {
      show.value = false;
      reload.value = reload.value + 1;
      showSuccesInfo.value = true;
      window.setTimeout(()=>{
        showSuccesInfo.value = false;
      }, 3000)
    }

    const show = ref(false);

    const showSuccesInfo = ref(false);

    const loading = ref(false);

    const showReject = ref(false);

    async function confirmRejectOrder() {
      loading.value = true;
      try {
        const response = await orderStore.update(selectedOrderId.value, {
          status: OrderStatus.REJECTED,
        });
        showReject.value = false;
        loading.value = false;
        reload.value = reload.value + 1;
        toast.success("Commande rejetée avec succès");
      } catch (error: any) {
        toast.success("Rejet impossible");
      }
    }

    function goToViewMD(id: string) {
      router.push({
        name: "sousDistributeursDetails",
        params: {
          id: id,
        },
      });
    }

    function goToViewDeliveryMan(id: string) {
      router.push({
        name: "livreursDetails",
        params: {
          id: id,
        },
      });
    }

    function onFetch(items:any){
      showItemOrder(items[0])
      
    }

    // onMounted(async () => {
    //   const response = await orderStore.historyOrder("");
    //   infoHistoryOrder.value = response;
    // });
    return {
      titles,
      goToCreateAppros,
      order,
      orderStore,
      getStatutLabel,
      getStatutType,
      helpers,
      actions,
      OrganisationType,
      partenaireTitle,
      show,
      orderAcceptSuccessful,
      selectedOrderId,
      reload,
      showSuccesInfo,
      filterActions,
      showItemOrder,
      justAssign,
      showReject,
      loading,
      confirmRejectOrder,
      goToViewMD,
      goToViewDeliveryMan,
      showHistoric,
      showModal,
      onFetch
      // infoHistoryOrder,
      // getHistoryOrder,
    };
  },
});
</script>

<style scoped></style>
