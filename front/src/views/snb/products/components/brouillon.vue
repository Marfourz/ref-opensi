<template>
    <div class="">
      <div class="pt-8">
        <BaseTabs :tabs="tabs" @change="categoryId = $event">
          <template #[tab.name] v-for="tab in tabs">
            <BaseTable
              class="pt-10"
              :data="products"
              :titles="titles"
              :key="tab.name"
              :actions="actions"
            >
  
            <template #image>
                      <div class="flex justify-center">
                        <img src="@/assets/images/beverage.png" alt="">
                      </div>
                    
                  </template>
              
            </BaseTable>
          </template>
        </BaseTabs>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref } from "vue";
  import { useProductStore } from "@/stores/product.ts";
  
  import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue";
  
  import { useRouter } from "vue-router";
  import { useProductCategoryStore } from "@/stores/product-category";
  
  import UploadFileVue from "@/components/UploadFile.vue";
  import { PackagingType } from "@/types/enumerations";
  import { Form } from "vee-validate";
  import { useToast } from "vue-toastification";
  import { IProduct } from "@/types/interfaces";
  
  export default defineComponent({
    components: { BaseTableWithFilter, UploadFileVue, Form },
    setup() {
      const productStore = useProductStore();
      const productCategoryStore = useProductCategoryStore();
      const toast = useToast();
  
      const total = ref(0);
  
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
  
      const router = useRouter();
      function goToProductCategory() {
        router.push({ name: "categories" });
      }
  
      function getStock(element: IProduct) {
        if (element.stocks && element.stocks[0])
          return element.stocks[0].originalQunatity;
        else return 0;
      }
  
      const titles = [
        {
          title: "Identifiant",
          name: "image",
        },
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
          name: "bulkPrice",
        },
        {
          title: "Date de création",
          name: "createdAt",
        },
        {
          title: "Quantité en stock",
          name: "stock",
          transform: getStock,
        },
        {
          title: "Action",
          name: "action",
        },
      ];
  
      const selectedProduct = ref();
  
      const product = reactive({
        name: "",
        unitPrice: 0,
        packagingType: PackagingType.PACK,
        bulkPrice: 0,
        volume: 0,
        categoryId: "",
      });
  
      const showModal = ref(false);
  
      const categories = ref([]);
  
      const tabs = computed(() => {
        if (categories.value && categories.value.length != 0) {
          const elements = [] as Array<{ name: string; libelle: string }>;
  
          categories.value.forEach((element: any) => {
            elements.push({
              name: element.id,
              libelle: element.name,
            });
          });
          return elements;
        }
        return [];
      });
  
      const categoryId = ref("");
  
      const products = ref([]);
      async function loadProducts() {
        try {
          const response = await productCategoryStore.fetchProducts(
            {},
            categoryId.value
          );
          products.value = response.data;
        } catch (error) {
          toast.error("Problème lors du chargment des produits");
        }
      }
  
      onMounted(async () => {
        try {
          const response = await productCategoryStore.fetchAll({});
  
          categories.value = response.data;
          categoryId.value = response.data[0].id;
          await loadProducts();
        } catch (error: any) {}
      });
      return {
        tabs,
        productStore,
        productCategoryStore,
        titles,
        actions,
        total,
        goToProductCategory,
        selectedProduct,
        product,
        showModal,
        categories,
        categoryId,
        loadProducts,
        products,
      };
    },
  });
  </script>
  
  <style scoped></style>
  