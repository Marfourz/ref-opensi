<template>
    <div class=""> 
         
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        title:{
            type : String,
            required : true
        },

        subtitle:{
            type : String
        },

        icon : {
            type : String
        },

        primaryColor : {
            
        }
        
    },
    setup () {
        

        return {}
    }
})
</script>

<style scoped>

</style>