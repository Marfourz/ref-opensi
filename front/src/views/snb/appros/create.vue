<template>
  <PageInTwoPart>
    <template #firstPart>
      <div class="space-y-8">
        <BaseTitle title="Nouvel appro"></BaseTitle>
        <div class="flex flex-wrap space-x-3.5">
          <ProductCategory
            class="my-2"
            :isActive="category.id == categoryId"
            :category="category"
            v-for="category in categories"
            :key="category.name"
            @click="categoryId = category.id"
          >
          </ProductCategory>
        </div>

        <div class="grid gap-5 grid-cols-3">
          <div v-for="product in products" :key="product.id">
            <ProductInput :product="product" />
          </div>
        </div>
      </div>
    </template>
    <template #secondPart>
      <div class="space-y-3 h-full">
        <BaseTitle title="Appro"></BaseTitle>
        <Basket></Basket>
      </div>
    </template>
  </PageInTwoPart>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import PageInTwoPart from "@/components/PageInTwoPart.vue";
import ProductInput from "../../../components/ProductInput.vue";
import ProductCategory from "../../../components/ProductCategory.vue";
import Basket from "../../../components/Basket.vue";
import { useProductStore } from "../../../stores/product";
import { useProductCategoryStore } from "../../../stores/product-category";
import {
  IProduct,
  IProductCategory,
  PrimaryKey,
} from "../../../types/interfaces";

export default defineComponent({
  components: { PageInTwoPart, ProductInput, ProductCategory, Basket },
  setup() {
    const productStore = useProductStore();

    const productCategoryStore = useProductCategoryStore();

    const categoryId = ref<PrimaryKey>("");

    const categories = ref<Array<IProductCategory>>([]);

    const products = ref<Array<IProduct>>([]);

    onMounted(async () => {
      try {
        const response = await productCategoryStore.fetchAll();

        categoryId.value = response.data[0].id;

        categories.value = response.data;

        await loadProduct();
      } catch (error: any) {}
    });

    async function loadProduct() {
      const response = await productCategoryStore.fetchProducts(
        { page: -1 },
        categoryId.value
      );
      products.value = response.data;
    }

    watch(categoryId, (newValue) => {
      loadProduct();
    });

    return {
      categories,
      categoryId,
      products,
    };
  },
});
</script>

<style scoped></style>
