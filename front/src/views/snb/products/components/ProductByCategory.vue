<template>
  <div class="">
    <div class="pt-8">
      <div>
        <div class="flex flex-col items-center space-y-4" v-show="!total || total == 0">
          <img src="@/assets/images/emptyProduct.png" alt="" />
          <div class="font-semibold text-center">
            Aucun produit dans le stock
          </div>
        </div>

        <BaseTabs :tabs="tabs" @change="categoryId = $event" v-show="total != 0" :selectedTab="categoryId">
          <template #[tab.name] v-for="tab in tabs">
            <BaseTableWithFilter :key="tab.name" :fetchData="productStore.fetchAllProductsStock" :titles="titles"
              :actions="actions" :requestId="organisationId" :params="{ categoryId: categoryId }" class="mt-6"
              :downloadData="productStore.downloadProductsStock"
              >
              <template #image="{ element }">
                <div>
                  <img :src="`${element.product.image && element.product.image[0]
                      ? element.product.image[0].url
                      : '/assets/images/beverage.png'
                    }`" alt="" />
                </div>
              </template>
              <template #volume="{ element }">
                <div>{{ helpers.currency(element.product.volume) }} CL</div>
              </template>
            </BaseTableWithFilter>
          </template>
        </BaseTabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from "vue";
import { useProductStore } from "@/stores/product";

import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue";

import { useRoute, useRouter } from "vue-router";
import { useProductCategoryStore } from "@/stores/product-category";

import UploadFileVue from "@/components/UploadFile.vue";
import { PackagingType } from "@/types/enumerations";
import { Form } from "vee-validate";
import { useToast } from "vue-toastification";
import { IProduct } from "@/types/interfaces";
import { ITitle } from "../../../../components/base/BaseTable.vue";
import { IAction } from "@/types/interfaces";
import { useUsersStore } from "../../../../stores/users";
import helpers from "@/helpers/index";

export default defineComponent({
  components: { BaseTableWithFilter, UploadFileVue, Form },

  props: {
    titles: {
      type: Array as () => Array<ITitle>,
      required: true,
    },
    actions: {
      type: Array as PropType<Array<IAction>>,
    },
  },
  setup(props, context) {
    const productStore = useProductStore();
    const productCategoryStore = useProductCategoryStore();

    const total = ref(0);

    const router = useRouter();
    function goToProductCategory() {
      router.push({ name: "categories" });
    }

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

    const userStore = useUsersStore();
    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    const categoryId = ref("");

    watch(categoryId, (newValue) => {
      context.emit("categoryIdChange", categoryId.value);
    });

    const route = useRoute();

    watch(organisationId, (newValue) => {
      console.log("eeeeeeeeee");

      getTotal();
    });

    async function getTotal() {
      const response = await productStore.fetchAllProductsStock(
        {},
        organisationId.value
      );
      console.log("response response", response);

      total.value = response.count;
    }

    onMounted(async () => {
      try {
        const response = await productCategoryStore.fetchAll({});

        categories.value = response.data;

        categoryId.value = response.data[0].id;
      } catch (error: any) { }
      await getTotal();
    });
    return {
      tabs,
      productStore,
      productCategoryStore,
      total,
      goToProductCategory,
      selectedProduct,
      product,
      showModal,
      categories,
      categoryId,
      organisationId,
      helpers,
    };
  },
});
</script>

<style scoped></style>
