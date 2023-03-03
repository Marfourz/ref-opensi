<template>
    <div class="border flex flex-col items-center rounded-lg px-4 py-6 space-y-4 relative"
        :class="{'border-success' : isValidate}">
        <div class="absolute bg-success top-0 right-0 p-2 rounded-tr-lg rounded-bl-lg" v-if="isValidate">
            <BaseIcon name="check" class="text-white"></BaseIcon>
        </div>
        <img src="@/assets/images/beverage.png" alt="" class="w-4 h-16">
        <div class="flex flex-col items-center">
            <div>{{ product.name }}</div>
            <div class="text-[#0F0F14] font-bold">{{ product.bulkPrice }} F /Casier</div>
        </div>
        
        <div class="flex items-end space-x-2" v-if="!isValidate">
            <div>
                <label for="" class="text-xs text-[#6B7A99]">Nombre de casiers</label>
               
                <BaseInput label="" v-model.number="quantity" class="h-5"></BaseInput>
            </div>
          
            <div class=" w-12 h-9 rounded flex items-center justify-center bg-primary text-white" @click="onSubmit">
                <BaseIcon name="plus" ></BaseIcon>
            </div>
        </div>




        <div class="rounded-full border flex items-center w-fit h-fit px-6 py-2.5 space-x-2" v-else>
            <div>{{quantity}} </div>
            <BaseIcon name="editProduct" @click="edit"></BaseIcon>
            <BaseIcon name="close" @click="close"></BaseIcon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,onMounted,ref } from 'vue'
import { useBasketStore } from '../stores/basket'
import type { PropType } from 'vue'
import type { IProduct } from '../types/interfaces'



export default defineComponent({
    props:{
        product : {
            type : Object as PropType<IProduct>,
                required : true
        }
    },
    setup (props) {
        const isValidate = ref(false)

        const quantity = ref()

        const basketStore = useBasketStore()

        function edit(){
            isValidate.value = false
        }

        function close(){
            basketStore.withdrawProduct(props.product.id)
            isValidate.value = false
            quantity.value = null
        }

        function onSubmit(){
            if(quantity.value > 0){
                isValidate.value = true
                basketStore.addToBasket(props.product, quantity.value)
            }
            
        }

        onMounted(()=>{
            const item = basketStore.getProductItem(props.product.id)
            if(item){
                quantity.value = item?.quantity
                isValidate.value = true
            }
           
            
        })

        return {
            isValidate,
            quantity,
            onSubmit,
            edit,
            close

        }
    }
})
</script>

<style scoped>

</style>