<template>
    <div class="font-semibold text-2xl">
        {{ title }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props:{
        title : String
    }
    
})
</script>

<style scoped>

</style>