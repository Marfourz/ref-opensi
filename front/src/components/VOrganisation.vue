<template>
  <BaseTableWithFilter :titles="titles"> </BaseTableWithFilter>
          <!-- <div
            v-if="statPartners.dp.length == 0"
            class="h-full flex flex-col justify-center"
          >
            <EmptyState
              title="Vos top dépôts <br> apparaîtront ici"
              image=""
              :textPosition="TextPosition.TOP"
            ></EmptyState> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const titles = [
      {
        title: "Nom",
        name: "socialReason",
      },
      {
        title: "Téléphone",
        name: "phone",
      },
      {
        title: "Email",
        name: "email",
      },

      {
        title: "Commandes",
        name: "commandes",
        // transform: getTotalOrder,
      },
      {
        title: "Chiffre d’affaire",
        name: "wallet.turnovers",
      },
      {
        title: "Statut",
        name: "status",
      },
    ];
    return {
      titles,
    };
  },
});
</script>

<style scoped></style>
