<template>
    <div class="flex space-x-4 items-center text-primary font-bold ml-2 cursor-pointer" @click="goBack">
        <BaseIcon name="arrowLeft" class="w-4 h-4"></BaseIcon>
        <div>Retour</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'


export default defineComponent({
    setup () {
        const router = useRouter()

        function goBack(){
            router.back()
        }

        return {
            goBack
        }
    }
})
</script>

<style scoped>

</style>