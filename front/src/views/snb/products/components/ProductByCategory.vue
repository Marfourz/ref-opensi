<template>
  <div class="pt-8">
    <BaseTabs :tabs="tabs" @change="categoryId = $event">
      <template #[tab.name] v-for="tab in tabs">
        <BaseTableWithFilter
          :key="tab.name"
          :fetchData="productCategoryStore.fetchProducts"
          :titles="titles"
          :actions="actions"
          :hideFilter="withoutFilter"
          :requestId="categoryId"
          @total="total = $event"
          class="mt-6"
        ></BaseTableWithFilter>
      </template>
    </BaseTabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useProductCategoryStore } from "@/stores/product-category";

export default defineComponent({
    props:{
        withoutFilter : {
            type : Boolean,
            default : false
        }
    },
  setup() {
    const categories = ref([]);

    const productCategoryStore = useProductCategoryStore();

    const total = ref(0);

    const titles = [
      {
        title: "Nom du produit",
        name: "name",
      },

      {
        title: "Volume",
        name: "volume",
      },

      {
        title: "Prix/Casier",
        name: "packPrice",
      },
      {
        title: "Date de création",
        name: "createdAt",
      },
      {
        title: "Quantité en stock",
        name: "stock",
      },
      {
        title: "Action",
        name: "action",
      },
    ];

    const actions = [
      {
        title: "Voir détail",
        icon: "eye",
        action: onView,
      },
      {
        title: "Modifier",
        icon: "edit",
        action: onUpdate,
      },
      {
        title: "Supprimer",
        icon: "removeRed",
        action: onDelete,
      },
    ];

    function onView() {}
    function onUpdate() {}
    function onDelete() {}

    const tabs = computed(() => {
      if (categories.value && categories.value.length != 0) {
        const elements = [] as Array<{ name: string; libelle: string }>;

        categories.value.forEach((element: any) => {
          elements.push({
            name: element.value,
            libelle: element.title,
          });
        });
        return elements;
      }
      return [];
    });

    const categoryId = ref("");

    onMounted(async () => {
      try {
        const response = await productCategoryStore.fetchAll({});

        categoryId.value = response[0].id;

        categories.value = response.map((value: any) => {
          return {
            value: value.id,
            title: value.name,
          };
        });
      } catch (error: any) {}
    });

    return {
      categories,
      tabs,
      categoryId,
      productCategoryStore,
      titles,
      actions,
      total,
    };
  },
});
</script>

<style scoped></style>
