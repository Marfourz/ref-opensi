<template>
    <div class="flex flex-col  items-center space-y-4">
        <div class="font-semibold text-center " v-html="title" v-if="textPosition == TextPosition.TOP"></div>
        <img src="@/assets/images/emptyState.png" alt="">
        <div class="font-semibold text-center " v-html="title" v-if="textPosition == TextPosition.BOTTOM"></div>
        
       
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

enum TextPosition{
    BOTTOM = "bottom",
    TOP = "top"
}


export default defineComponent({
    props:{
        textPosition : {
            type: String,
            default: TextPosition.BOTTOM
        },
        image : {
            type : String,
            required : true
        },

        title : {
            type : String,
            required : true
            
        }
    },
    setup (props) {

        const imageUrl = ref("")


        onMounted(async ()=>{

            imageUrl.value = await import(props.image).then((module) => imageUrl.value = module.default);
        })

    
        //const imageUrl = ref(new URL("/assets/images/emptyProduct.png", import.meta.url).href)
        
     
        return {
            imageUrl,
            TextPosition
        }
    }
})
</script>

<style scoped>

</style>