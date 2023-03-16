<template>
  <div class="" :key="reload">
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

    <BaseModal :show="show" @close="show = false" title="Accepter la commande">
      <FormAssignDeliveryPerson
        :orderId="selectedOrderId"
        @submitSuccess="orderAcceptSuccessful"
      ></FormAssignDeliveryPerson>
    </BaseModal>
    <PageInTwoPart>
      <template #firstPart>
        <div class="space-y-8">
          <BaseTitle title="Mes commandes"></BaseTitle>
          <div class="relative">
            <BaseTableWithFilter
              :titles="titles"
              :requestId="organisationId"
              :fetchData="orderStore.fetchAllByOrganizationType"
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
              <div class="border rounded-lg py-2.5 px-4 flex justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    class="rounded-full flex items-center justify-center bg-[#EDEFF3] w-12 h-12"
                  >
                    <BaseIcon name="shop"></BaseIcon>
                  </div>
                  <div class="">
                    <div class="text-[#6B7A99]">{{ partenaireTitle }}</div>
                    <div class="font-bold">
                      {{ order.organisation?.socialReason }}
                    </div>
                  </div>
                </div>
                <div
                  class="border border-[#6B7A99] py-2.5 px-2 rounded font-semibold cursor-pointer"
                >
                  Voir le profil
                </div>
              </div>
              <div class="flex space-x-2 items-center">
                <div class="font-bold text-lg">
                  Commande {{ order.reference }}
                </div>
                <BaseTableStatut
                  :title="getStatutLabel(order)"
                  :type="getStatutType(order)"
                ></BaseTableStatut>
              </div>
            </div>
          </template>
        </Order>
        <div class="flex h-full flex-col justify-center" v-else>
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

import FormAssignDeliveryPerson from "./components/FormAssignDeliveryPerson.vue";

import SuccessInfo from "../../../components/SuccessInfo.vue";

export default defineComponent({
  components: {
    PageInTwoPart,
    Order,
    EmptyState,
    FormAssignDeliveryPerson,
    SuccessInfo,
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

    async function showItemOrder(element: any) {
      try {
        const response = await orderStore.fetchOne(element.id);
        order.value = response;
      } catch (error) {
        toast.error("T");
      }
    }

    const selectedOrderId = ref();

    async function acceptOrder(order: any) {
      show.value = true;
      selectedOrderId.value = order.id;
    }

    const reload = ref(1);

    function orderAcceptSuccessful() {
      show.value = false;
      reload.value = reload.value + 1;
      showSuccesInfo.value = true;
    }

    const show = ref(false);

    const showSuccesInfo = ref(false);

    return {
      titles,
      goToCreateAppros,
      order,
      organisationId,
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
    };
  },
});
</script>

<style scoped></style>
