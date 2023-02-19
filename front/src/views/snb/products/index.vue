<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <BaseTitle title="Produits"></BaseTitle>
        <BaseButton icon="plus" size="small">Nouveau produit</BaseButton>
      </div>
      <div class="text-link underline cursor-pointer font-semibold">
        Gestion des catégories
      </div>
    </div>

    <div class=" px-8 pt-12">
      <EmptyState
        title="Vos produits ajoutés seront visibles ici. <br> Cliquez sur le bouton Nouveau produit <br> pour ajouter des produits"
        image="/src/assets/images/emptyProduct.png"
      ></EmptyState>
    </div>

    <BaseTabs :tabs="tabs" class="mt-7">
    </BaseTabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import EmptyState from "../../../components/EmptyState.vue";
import useProdu


export default defineComponent({
  components: { EmptyState },
  setup() {
    const tabs = computed(()=>{
        return [{
            name : "Bière",
            libelle : "Bière"
        },
        {
            name : "Boisson gazeuses",
            libelle : "gazeuse"
        }]
    })

    return {
        tabs
    };
  },
});
</script>

<style scoped></style>
