<template>
  <div class="h-full">
    <div
      v-if="items.length == 0"
      class="flex flex-col h-full justify-center px-8"
    >
      <div class="flex flex-col items-center space-y-4">
        <img src="@/assets/images/emptyBasket.png" alt="" />
        <div class="font-semibold text-center">
          Veuillez sélectionner vos produits dans le catalogue
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col justify-between h-[calc(100vh-160px)]">
      <div class="space-y-4 h-[calc(100vh-300px)] overflow-scroll">
        <div v-for="item in items" :key="item.product.name">
          <BasketItem
            :product="item.product"
            :quantity="item.quantity"
          ></BasketItem>
        </div>
      </div>

      <div class="text-[14px] space-y-3 pt-4">
        <div>Méthode de paiement</div>
        <div class="flex space-x-2 border-b pb-3">
          <div class="flex space-x-2 items-center cursor-pointer" @click="changePaymentMethod(PaymentMethod.KKIAPAY)">
            <BaseSelectedCard
              :selected="selectedPaymentMethod == PaymentMethod.KKIAPAY"
              
            >
              <BaseIcon name="digitalMoney"></BaseIcon>
            </BaseSelectedCard>
            <div class="font-semibold">Mobile Money ou Virement bancaire</div>
          </div>

          <div class="flex space-x-2 items-center cursor-pointer" @click="changePaymentMethod(PaymentMethod.CASH)">
            <BaseSelectedCard
              :selected="selectedPaymentMethod == PaymentMethod.CASH"
              
            >
              <BaseIcon :name="`calendar${paymentDeadline}`"></BaseIcon>
            </BaseSelectedCard>
            <div class="font-semibold">Paiement sur 30 jours</div>
          </div>
        </div>
        <div class="flex justify-between font-semibold text-xl mt-1">
          <div>Total</div>
          <div>{{ totalAmount }} F</div>
        </div>
        <BaseButton class="w-full" :loading="loading" @click="onSubmit"
          >Payer maintenant</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { IItem, useBasketStore } from "../stores/basket";
import EmptyState from "@/components/EmptyState.vue";
import BasketItem from "./BasketItem.vue";
import { PaymentMethod } from "../types/enumerations";
import {
  openKkiapayWidget,
  addKkiapayListener,
  removeKkiapayListener,
} from "kkiapay";
import { useOrdersStore } from "../stores/orders";
import { useUsersStore } from "../stores/users";
import { PrimaryKey } from "../types/interfaces";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { EmptyState, BasketItem },
  setup() {
    const basketStore = useBasketStore();

    const items = computed(() => {
      return basketStore.getItems;
    });

    const totalAmount = computed(() => {
      return basketStore.getBasketPrice;
    });

    const loading = ref(false);

    const ordersStore = useOrdersStore();

    const userStore = useUsersStore();

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    const toast = useToast();

    const router = useRouter();


    async function makeAppro(transactionId : string | undefined){
      const orders = items.value.map((item: IItem) => {
        return {
          productId: item.product.id,
          quantity: item.quantity,
        };
      });

      try{
        
        
        const response = await ordersStore.create({
        organisationId: organisationId.value,
        items: orders,
        transactionId : transactionId
      });

      router.push({ name: "appros" });
        toast.success("Commande effectuée avec succès");
        basketStore.clearBasket();
      }
      catch(error:any){
        console.log("error.response",error.response.data);
        
        toast.error(error.response.data.message)
        router.push({ name: "appros" });
      }

      
     
      }


    

    async function onSubmit() {
      if(selectedPaymentMethod.value == PaymentMethod.KKIAPAY){
        kkiapayWidget()
      }
      else{
        await makeAppro(undefined) 
      }
     
      
    }

    async function successHandler(paymentResponse: { transactionId: string }) {
      await makeAppro(paymentResponse.transactionId)
      }

    function kkiapayWidget() {
      openKkiapayWidget({
        amount: totalAmount.value,
        api_key: import.meta.env.VITE_APP_KKIAPAY_KEY,
        sandbox: true,
        phone: "97000000",
      });
    }


   



    const selectedPaymentMethod = ref<PaymentMethod>(PaymentMethod.KKIAPAY);

    function changePaymentMethod(method: PaymentMethod) {
      selectedPaymentMethod.value = method;
    }

    const paymentDeadline = computed(()=>{
      return userStore.getCurrentUser?.organisation.paymentDeadline
    })

    

    onMounted(() => {
      //basketStore.clearBasket();
      addKkiapayListener('success', successHandler);
    });
    return {
      items,
      totalAmount,
      selectedPaymentMethod,
      PaymentMethod,
      changePaymentMethod,
      kkiapayWidget,
      onSubmit,
      loading,
      paymentDeadline
    };
  },
});
</script>

<style scoped></style>
