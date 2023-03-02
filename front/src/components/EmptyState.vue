<template>
    <div class="flex flex-col  items-center space-y-4">
        <img :src="image" alt="">
        <div class="font-semibold text-center " v-html="title"></div>
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