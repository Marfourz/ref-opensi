<template>
 
    <div>
        <div
          class="fixed -top-10 bottom-0 left-0 right-0 bg-black opacity-40"
        ></div>
       
        <div
          class="fixed bottom-0 left-0 right-0 h-1/2 flex flex-col space-y-4"
        >
          <div class="flex justify-end pr-4">
            <BaseIcon name="close" class="w-4 h-4 text-white" @click="$emit('close')"></BaseIcon>
          </div>
          <div
            class="flex flex-col items-center space-y-4 bg-white shadow-2xl rounded-t-3xl h-full p-4 justify-end"
          >
            <div>
              <img src="@/assets/images/beverage.png" alt="" class="w-4 h-16" />
            </div>
            <div class="flex flex-col items-center w-full">
              <div>{{ product.name }}</div>
              <div class="text-[#0F0F14] font-bold">{{product.bulkPrice}} F /Casier</div>
            </div>
            <div class="w-full">
                <label for="" class="text-[#6B7A99] font-semibold"
                  >Nombre de casiers</label
                >
                <BaseInput label="" v-model="quantity" class="w-full"></BaseInput>
              </div>
            <BaseButton class="w-full " @click="onSubmit">Ajouter</BaseButton>
          </div>
        </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import { useBasketStore } from "../stores/basket";
  import type { PropType } from "vue";
  import type { IProduct } from "../types/interfaces";
  
  export default defineComponent({
    props: {
      product: {
        type: Object as PropType<IProduct>,
        required: true,
      },
    },
    setup(props, context) {
    
  
      const quantity = ref();
  
      const basketStore = useBasketStore();

      function onSubmit() {
        if (quantity.value > 0) {
          basketStore.addToBasket(props.product, quantity.value);
          context.emit('close')
        }
      }
  
      onMounted(() => {
        const item = basketStore.getProductItem(props.product.id);
        if (item) {
          quantity.value = item?.quantity;
        }
      });
  
      return {
        
        quantity,
        onSubmit,
       
        close,
      };
    },
  });
  </script>
  
  <style scoped></style>
  