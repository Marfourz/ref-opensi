<template>
    <div class="relative rounded-lg border p-3 w-fit h-fit" :class="{'border-success' : selected}">
        <slot></slot>
        <div class="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center bg-success " v-if="selected" >
            <BaseIcon name="check" class="w-3 h-3 text-white"></BaseIcon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        selected : {
            type : Boolean,
            default : false
        },
        title : {
            type : String
           
        }
    },
    setup () {
        

        return {}
    }
})
</script>

<style scoped>

</style>