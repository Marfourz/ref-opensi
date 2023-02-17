<template>
    <div class="cursor-pointer w-fit h-fit flex py-2 px-4 font-semibold rounded-full px-4.5  space-x-2.5 items-center " :class="{'text-white bg-primary' : isActive, 'border': !isActive}">
        <BaseIcon name="home"></BaseIcon>
        <div>{{ category.name }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { IProductCategory } from '../types/interfaces'
import type { PropType } from 'vue';


export default defineComponent({
    props:{
        isActive : {
            type : Boolean,
            default : false
        },
        category : {
            type : Object as PropType<IProductCategory>,
            required : true
        }
    }
})
</script>

<style scoped>

</style>