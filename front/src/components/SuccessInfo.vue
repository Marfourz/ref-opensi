<template>
    <div class="rounded-lg py-4 px-5 bg-[#E9F9EF] flex items-center space-x-5">
        <BaseIcon name="check" class="text-success w-5 h-5"></BaseIcon>
        <div class="text-[#0E603D] font-semibold">{{ title }}</div>
        <BaseIcon name="close" class="text-[#6B7A99] w-4 h-4" @click="onClick"></BaseIcon>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        title : {
            type : String,
            required : true
        }
    },
    setup (props,context) {
        
        function onClick(){
            context.emit('close')
        }

        return {
            onClick
        }
    }
})
</script>

<style scoped>

</style>