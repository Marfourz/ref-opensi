<template>
  <div class="space-y-6">
    <BaseModal
      :title="modal.title"
      :show="modal.show"
      @close="modal.show = false"
    >
      <Form @submit="onSubmit" class="space-y-6" v-if="modal.mode == 'confirm'">
        <BaseSelect
          label="Nom du produit"
          :items="products"
          v-model="stock.productId"
        ></BaseSelect>
        <BaseInput
          name="quantité"
          v-model.number="stock.currentQuantity"
          rules="required"
          label="Quantité du produit( en casier / en pack)"
        ></BaseInput>
        <BaseButton class="w-full" :loading="loading">Ajouter</BaseButton>
      </Form>
      <template #modal>
        <div
          class="flex flex-col space-y-6 items-center py-4"
          v-if="modal.mode == 'success'"
        >
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center bg-success text-white"
          >
            <BaseIcon name="check" class="w-8 h-8"></BaseIcon>
          </div>
          <div
            class="font-bold text-2xl text-center"
            v-html="modal.title"
          ></div>
          <BaseButton class="w-full" @click="modal.show = false"
            >Terminé</BaseButton
          >
        </div>
      </template>
    </BaseModal>
    <div><BaseGoBack></BaseGoBack></div>
    <div class="flex items-center space-x-6">
      <BaseTitle title="Stock"></BaseTitle>
      <BaseButton icon="plus" size="small" @click="modal.show = true"
        >Nouveau stock</BaseButton
      >
    </div>

    <div :key="reload">
        <ProductByCategory
      :titles="titles"
      :actions="actions"
      @categoryIdChange="loadProducts"
     
    ></ProductByCategory>
    </div>
   
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  reactive,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import DashboardCard from "../../../components/DashboardCard.vue";
import { useProductCategoryStore } from "../../../stores/product-category";
import { IProduct, PrimaryKey } from "../../../types/interfaces";
import ProductByCategory from "../products/components/ProductByCategory.vue";
import { useProductStore } from "../../../stores/product";
import helpers from "@/helpers/index.ts";
import { useToast } from "vue-toastification";
import { Form } from "vee-validate";
import { useUsersStore } from "../../../stores/users";

export default defineComponent({
  components: { DashboardCard, ProductByCategory, Form },
  setup(props, context) {
    const router = useRouter();

    const products = ref([]);

    const titles = [
      {
        title: "Produits en stock",
        name: "name",
      },

      {
        title: "Quantité en stock",
        name: "stock",
        transform: getStock,
      },
    ];

    function getStock(element: IProduct) {
      if (element.stocks && element.stocks[0])
        return element.stocks[0].currentQuantity;
      else return 0;
    }

    const loading = ref(false);

    const modal = reactive({
      title: "Nouveau stock",
      type: "create" as "create" | "delete" | "update",
      show: false,
      mode: "confirm" as "confirm" | "success",
    });

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

    const stock = reactive({
      currentQuantity: 0,
      productId: "",
      organisationId: "",
    });

    const productCategoryStore = useProductCategoryStore();

    async function loadProducts(categoryId: PrimaryKey) {
      console.log("product change category", categoryId);
      try {
        const response = await productCategoryStore.fetchProducts(
          {},
          categoryId
        );

        products.value = response.data.map((value: IProduct) => {
          return {
            title: value.name,
            value: value.id,
          };
        });
      } catch (error) {}
    }

    const productStore = useProductStore();
    const toast = useToast();

    const reload = ref(false)

    async function onSubmit() {
        
      stock.organisationId = userStore.getCurrentUser?.organisationId as string;
      loading.value = true;
      try {
        const response = await productStore.createStock(stock);
        toast.success("Stock mise à jour avec succès");
        loading.value = false;
        modal.show = false;
        reload.value = !reload.value
      } catch (error) {
        loading.value = false;
        toast.error("Oups un problème est survenu. Contactez l'administrateur");
      }
    }

    const userStore = useUsersStore();

    onMounted(() => {});

    return {
      titles,
      actions,
      modal,
      loading,
      onSubmit,
      stock,
      loadProducts,
      products,
      reload
    };
  },
});
</script>

<style scoped></style>
