<template>
  <BaseTableWithFilter :titles="titles"> </BaseTableWithFilter>
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
