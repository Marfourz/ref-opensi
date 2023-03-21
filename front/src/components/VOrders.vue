<template>
  <PageInTwoPart2>
    <template #firstPart>
      <div class="space-y-8">
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
                Commande {{ order.reference }} {{ order.status }}
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
  </PageInTwoPart2>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import PageInTwoPart2 from "@/components/PageInTwoPart2.vue";
import { useOrdersStore } from "@/stores/orders";
import Order from "@/components/Order.vue";
import { OrderStatus, OrganisationType } from "@/types/enumerations";
import { useUsersStore } from "@/stores/users";
import helpers from "@/helpers/index";
import { useToast } from "vue-toastification";
import EmptyState from "@/components/EmptyState.vue";

export default defineComponent({
  components: {
    PageInTwoPart2,
    Order,
    EmptyState,
  },
  setup() {
    const titles = [
      {
        title: "Commande",
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
        title: "",
        name: "action",
      },
    ];
    const order = ref();
    const orderStore = useOrdersStore();
    const userStore = useUsersStore();
    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    function getStatutLabel(element: any) {
      if (element.status == OrderStatus.ACCEPTED) return "Accepté";
      else if (element.status == OrderStatus.DELIVERED) return "Inactif";
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
