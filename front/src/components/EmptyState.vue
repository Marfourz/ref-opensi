<template>
    <div class="h-full flex flex-col justify-center items-center space-y-4">
        <img src="@/assets/images/emptyBasket.png" alt="">
        <div class="font-semibold text-center ">{{ title }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        image : {
            type : String,
            required : true
        },

        title : {
            type : String,
            required : true
        }
    },
    setup () {
        

        return {}
    }
})
</script>

<style scoped>

</style>