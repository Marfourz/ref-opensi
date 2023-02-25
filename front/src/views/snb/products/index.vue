<template>
  <div class="">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <BaseTitle title="Produits"></BaseTitle>
        <BaseButton icon="plus" size="small" @click="showModal = true"
          >Nouveau produit</BaseButton
        >
      </div>
      <div
        class="text-link underline cursor-pointer font-semibold"
        @click="goToProductCategory"
      >
        Gestion des catégories
      </div>
    </div>

    <!-- <div class="px-8 pt-12" v-show="total == 0">
      <EmptyState
        title="Vos produits ajoutés seront visibles ici. <br> Cliquez sur le bouton Nouveau produit <br> pour ajouter des produits"
        image="/src/assets/images/emptyProduct.png"
      ></EmptyState>
    </div> -->

    <div class="pt-8">
      <BaseTabs :tabs="tabs" v-show="total == 0" @change="categoryId = $event">
        <template #[tab.name] v-for="tab in tabs">
          <BaseTableWithFilter
            :key="tab.name"
            :fetchData="productCategoryStore.fetchProducts"
            :titles="titles"
            :actions="actions"
            :requestId="categoryId"
            @total="total = $event"
            class="mt-6"
          ></BaseTableWithFilter>
        </template>
      </BaseTabs>
    </div>

    <BaseBottomModal :show="showModal">
      <div class="w-[80%]">
        <div class="border-b pb-2 flex items-center justify-between">
          <div class="font-bold text-2xl">
            {{ !selectedProduct ? "Ajouter un produit" : "Mettre à jour" }}
          </div>
          <BaseIcon
            name="close"
            class="w-5 h-5"
            @click="showModal = false"
          ></BaseIcon>
        </div>
        <div class="flex justify-center pt-6">
          <Form class="w-3/4 space-y-6" @submit="onSubmit">
            <BaseInput
              name="nom du produit"
              label="Nom du produit"
              rules="required"
              v-model="product.name"
            ></BaseInput>
            <BaseSelect
              label="Catégorie"
              :items="categories"
              v-model="product.category"
            ></BaseSelect>
            <BaseInput
              name="Volume"
              label="Volume"
              rules="required"
              v-model="product.volume"
            ></BaseInput>
            <BaseInput
              name="Prix unitaire"
              label="Prix unitaire( en FCFA)"
              rules="required"
              v-model="product.unitPrice"
            ></BaseInput>
            <!-- <BaseInput
              name="Unité"
              label="Unité"
              rules="required"
              v-model="product.packPrice"
            ></BaseInput> -->
            <BaseInput
              name="Prix casier (en FCFA)"
              label="Prix casier (en FCFA)"
              rules="required"
              v-model="product.rackPrice"
            ></BaseInput>

            <UploadFileVue></UploadFileVue>

            <BaseButton class="w-[200px]" :loading="loading">{{
              selectedProduct ? "Mettre à jour" : "Ajouter"
            }}</BaseButton>
          </Form>
        </div>
      </div>
    </BaseBottomModal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useProductStore } from "@/stores/product.ts";

import BaseTableWithFilter from "../../../components/base/BaseTableWithFilter.vue";

import { useRouter } from "vue-router";
import { useProductCategoryStore } from "../../../stores/product-category";

import UploadFileVue from "../../../components/UploadFile.vue";

export default defineComponent({
  components: { EmptyState, BaseTableWithFilter, UploadFileVue },
  setup() {
    const productStore = useProductStore();
    const productCategoryStore = useProductCategoryStore();

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

    const selectedProduct = ref();

    const product = reactive({
      name: "",
      unitPrice: 100,
      rackPrice: 1000,
      packPrice: 20000,
      volume: 2000,
      category: "",
    });

    const showModal = ref(false);

    const categories = ref([]);

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

    //Product creation

    const loading = ref(false);

    async function onSubmit() {
      try {
        const response = await productStore.create(product);
      } catch (error: any) {}
    }

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
      onSubmit,
      loading,
    };
  },
});
</script>

<style scoped></style>
