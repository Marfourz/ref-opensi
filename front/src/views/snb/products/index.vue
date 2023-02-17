<template>
    <div>
       <div class="flex justify-between items-center">
            <div class="flex items-center space-x-6">
                <BaseTitle title="Produits"></BaseTitle>
                <BaseButton icon="plus" size="small">Nouveau produit</BaseButton>
            </div>
            <div class="text-link underline cursor-pointer font-semibold">Gestion des catégories</div>
       </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup () {
        

        return {}
    }
})
</script>

<style scoped>

</style>