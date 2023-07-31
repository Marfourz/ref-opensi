<template>
  <PageInTwoPart>
    <template #firstPart>
      <div class="space-y-8">
        <router-link :to="{ name: 'appros' }" path="appros">
          <BaseGoBack> </BaseGoBack>
        </router-link>
        <div class="flex space-x-4 items-center">
          <BaseTitle title="Nouvel appro"></BaseTitle>
          <div class="rounded-full bg-[#FF5353] text-white p-3 flex items-center space-x-3 md:hidden">
            <span>{{ basketStore.getTotalProduct }}</span>
            <span>Produit(s) ajoutés</span>
            <BaseIcon name="arrowRight"></BaseIcon>
          </div>
        </div>
        
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

        <div class="grid md:gap-5 gap-2 grid-cols-2 md:grid-cols-3">
          <div v-for="product in products" :key="product.id">
            <ProductInput :product="product" @click="onSelectedProduct(product)" />
          </div>
        </div>


        <MobileProductInput :product="selectedProduct" v-if="mobileAddProduct" @close="mobileAddProduct = false"></MobileProductInput>
      </div>
    </template>
    <template #secondPart>
      <div class="space-y-3 md:h-full hidden md:block">
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
import MobileProductInput from "@/components/MobileProductInput.vue";
import {
  IProduct,
  IProductCategory,
  PrimaryKey,
} from "../../../types/interfaces";
import BaseIcon from "../../../components/base/BaseIcon.vue";
import BaseButton from "../../../components/base/BaseButton.vue";
import { useBasketStore } from "../../../stores/basket";

export default defineComponent({
  components: {
    PageInTwoPart,
    ProductInput,
    ProductCategory,
    Basket,
    BaseIcon,
    BaseButton,
    MobileProductInput,
  },
  setup() {
    const productStore = useProductStore();

    const productCategoryStore = useProductCategoryStore();

    const categoryId = ref<PrimaryKey>("");

    const categories = ref<Array<IProductCategory>>([]);

    const products = ref<Array<IProduct>>([]);

    const mobileAddProduct = ref(false);

    const selectedProduct = ref()

    const basketStore = useBasketStore()

    function onSelectedProduct(product : IProduct){
      selectedProduct.value = product
      mobileAddProduct.value = true
    }

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
      mobileAddProduct,
      selectedProduct,
      onSelectedProduct,
      basketStore
    };
  },
});
</script>

<style scoped></style>
