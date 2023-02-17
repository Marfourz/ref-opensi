<template>
  <div class="h-full">
   
    <div
      v-if="items.length == 0"
      class="flex flex-col h-full justify-center px-8"
    >
      <EmptyState
        title="Veuillez sélectionner vos produits dans le catalogue"
        image="@/assets/images/emptyBasket.png"
      ></EmptyState>
    </div>

    <div v-else class="flex flex-col justify-between h-full">
      <div class="space-y-4">
        <div v-for="item in items" :key="item.product.name">
          <BasketItem
            :product="item.product"
            :quantity="item.quantity"
          ></BasketItem>
        </div>
      </div>

      <div class="text-[14px] space-y-3">
        <div>Méthode de paiement</div>
        <div class="flex space-x-2  border-b pb-3">
          <div class="flex space-x-2 items-center">
            <BaseSelectedCard 
                :selected="selectedPaymentMethod == PaymentMethod.KKIAPAY" 
                @click="changePaymentMethod(PaymentMethod.KKIAPAY)">
              <BaseIcon name="digitalMoney"></BaseIcon>
            </BaseSelectedCard>
            <div class="font-semibold">Mobile Money ou carte bancaire</div>
          </div>

          <div class="flex space-x-2 items-center">
            
            <BaseSelectedCard 
                :selected="selectedPaymentMethod == PaymentMethod.CASH"
                @click="changePaymentMethod(PaymentMethod.CASH)">
              <BaseIcon name="calendar"></BaseIcon>
            </BaseSelectedCard>
            <div class="font-semibold">Paiement sur 30 jours</div>
          </div>
        </div>
        <div class="flex justify-between font-semibold text-xl">
            <div>Total</div>
            <div>{{totalAmount}} F</div>
        </div>
        <BaseButton class="w-full">Payer maintenant</BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent,onMounted,ref } from "vue";
import { useBasketStore } from "../stores/basket";
import EmptyState from "@/components/EmptyState.vue";
import BasketItem from "./BasketItem.vue";
import { PaymentMethod } from "../types/enumerations";

export default defineComponent({
  components: { EmptyState, BasketItem },
  setup() {
    const basketStore = useBasketStore();

    const items = computed(() => {
      return basketStore.getItems;
    });

    const totalAmount = computed(()=>{
        return basketStore.getBasketPrice
    })


    const selectedPaymentMethod = ref<PaymentMethod>(PaymentMethod.KKIAPAY)

    function changePaymentMethod(method : PaymentMethod){
        selectedPaymentMethod.value = method
    }

    onMounted(() =>{
        basketStore.clearBasket()
    })
    return {
      items,
      totalAmount,
      selectedPaymentMethod,
      PaymentMethod,
      changePaymentMethod
    };
  },
});
</script>

<style scoped></style>
