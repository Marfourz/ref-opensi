<template>
    <div class="h-sreen w-screen flex flex-col">
        <div class="h-16 py-2.5 px-8 bg-white flex items-center justify-between">

            <div class="flex items-center space-x-2">
                <BaseIcon icon="arrow-left" class="cursor-pointer" @click="goBack"></BaseIcon>
                <BaseIcon icon="pdf"></BaseIcon>
                <div class="text-grey-30 font-semibold text-[16px]">Affichage du contrat</div>
            </div>
            <a :href="link" ><BaseButton icon="download-pdf" type="success" >Télécharger</BaseButton></a>

        </div>
        <div class="bg-[#E5E5E5] flex items-center flex-1 justify-center pt-7">
            <div class="bg-white h-full w-1/2 ">
                <vue-pdf-embed :source='link' />

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted,ref,computed } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { useRouter,useRoute } from 'vue-router'

export default defineComponent({
    components: {
    VuePdfEmbed,
  },


    setup () {
        const route = useRoute()

        const router = useRouter()

        function goBack(){
            router.back()
        }
        
        const link = computed(()=>{
            return decodeURIComponent(route.params.link as string) 
        })

       return {
        link,
        goBack
       }
    }
})
</script>

<style scoped>

</style>