<template>
  <PageInTwoPart>
    <template #firstPart>
        
      <div class="space-y-8">
        <BaseTitle title="Nouvel appro"></BaseTitle>
        <div class="flex flex-wrap space-x-3.5">
          <ProductCategory
            :isActive="category.id == selectedCategory.id"
            :category="category"
            v-for="category in categories"
            :key="category.name"
            @click="selectedCategory = category"
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
import { defineComponent, ref } from "vue";
import PageInTwoPart from "@/components/PageInTwoPart.vue";
import ProductInput from "../../../components/ProductInput.vue";
import ProductCategory from "../../../components/ProductCategory.vue";
import products from "../../../data/product";
import Basket from "../../../components/Basket.vue";

export default defineComponent({
  components: { PageInTwoPart, ProductInput, ProductCategory, Basket },
  setup() {
    const categories = [
      {
        id: "1",
        name: "Bierre",
        description: "Descriptpion",
      },
      {
        id: "2",
        name: "Boisson gazeuse",
        description: "Descriptpion",
      },
    ];
    const selectedCategory = ref(categories[0]);
    return {
      categories,
      selectedCategory,
      products,
    };
  },
});
</script>

<style scoped></style>
