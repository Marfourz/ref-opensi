<template>
  <div class="">
    <BaseModal
      :title="modal.title"
      :show="modal.show"
      @close="modal.show = false"
    >
      <template #modal>
        <div
          class="flex flex-col space-y-6 items-center py-4"
          v-if="modal.type == 'delete'"
        >
          <BaseIcon name="warning"></BaseIcon>
          <div
            class="text-center font-semibold text-2xl"
            v-html="modal.title"
          ></div>
          <div class="flex items-center space-x-2 w-full">
            <BaseButton
              bgColor="danger"
              :outline="true"
              class="w-1/2"
              @click="modal.show = false"
            >
              Annuler
            </BaseButton>
            <BaseButton
              bgColor="danger"
              :loading="loading"
              class="w-1/2 bg-danger"
              @click="deleteProduct"
            >
              Supprimer
            </BaseButton>
          </div>
        </div>
      </template>
    </BaseModal>

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

    <div class="px-8 pt-12" v-show="total == 0">
      <div class="flex flex-col items-center space-y-4">
        <img src="@/assets/images/emptyProduct.png" alt="" />
        <div class="font-semibold text-center">
          Vos produits ajoutés seront visibles ici. <br />
          Cliquez sur le bouton Nouveau produit <br />
          pour ajouter des produits
        </div>
      </div>

      <!-- <EmptyState
        title="Vos produits ajoutés seront visibles ici. <br> Cliquez sur le bouton Nouveau produit <br> pour ajouter des produits"
        image="/assets/images/emptyProduct.png"
      ></EmptyState> -->
    </div>

    <div class="pt-8" v-show="total != 0">
      <BaseTabs
        :tabs="tabs"
        @change="categoryId = $event"
        :selectedTab="categoryId"
      >
        <template
          #[tab.name]
          v-for="tab in tabs"
          :key="`${tab.name}-${reload}`"
        >
          <BaseTableWithFilter
            :fetchData="productCategoryStore.fetchProducts"
            :titles="titles"
            :actions="actions"
            :requestId="categoryId"
            class="mt-6"
          >
            <template #image="{ element }">
              <div>
                <img
                  :src="`${
                    element.image && element.image[0]
                      ? element.image[0].url
                      : '@/assets/images/beverage.png'
                  }`"
                  alt=""
                />
              </div>
            </template>
          </BaseTableWithFilter>
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
              v-model="product.categoryId"
            ></BaseSelect>
            <BaseInput
              name="Volume"
              label="Volume (en CL)"
              rules="required|numeric"
              v-model.number="product.volume"
            ></BaseInput>
            <BaseInput
              name="Prix unitaire"
              label="Prix unitaire( en FCFA)"
              rules="required|numeric"
              v-model.number="product.unitPrice"
            ></BaseInput>
            <BaseSelect
              label="Unité"
              :items="packagingTypes"
              v-model="product.packagingType"
            ></BaseSelect>
            <BaseInput
              name="Prix casier (en FCFA)"
              :label="packPriceLabel"
              rules="required|numeric"
              v-model.number="product.bulkPrice"
            ></BaseInput>

            <UploadFileVue
              @change="image = $event"
              :onlineFile="
                selectedProduct && selectedProduct.image
                  ? selectedProduct.image[0]
                  : {}
              "
            ></UploadFileVue>

            <div class="pb-2">
              <BaseButton class="w-[200px]" :loading="loading">{{
                selectedProduct ? "Mettre à jour" : "Ajouter"
              }}</BaseButton>
            </div>
          </Form>
        </div>
      </div>
    </BaseBottomModal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useProductStore } from "@/stores/product";
import BaseTableWithFilter from "../../../components/base/BaseTableWithFilter.vue";
import { useRouter } from "vue-router";
import { useProductCategoryStore } from "../../../stores/product-category";
import UploadFileVue from "../../../components/UploadFile.vue";
import { PackagingType } from "../../../types/enumerations";
import { Form } from "vee-validate";
import { useFileStore } from "../../../stores/file";
import { useToast } from "vue-toastification";
import { IProduct } from "../../../types/interfaces";
import helpers from "@/helpers/index";

export default defineComponent({
  components: { EmptyState, BaseTableWithFilter, UploadFileVue, Form },
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

    function onView(value: IProduct) {}

    function onUpdate(value: IProduct) {
      product.name = value.name;

      product.packagingType = PackagingType.PACK;
      product.bulkPrice = value.bulkPrice;
      product.volume = value.volume;
      product.categoryId = value.categoryId;
      product.unitPrice = value.unitPrice;
      selectedProduct.value = value;

      showModal.value = true;
    }

    const modal = reactive({
      title: "",
      type: "create" as "create" | "delete" | "update",
      show: false,
    });

    function onDelete(value: IProduct) {
      modal.title = `Êtes-vous sûr de vouloir <br> supprimer cette boisson ?`;
      modal.show = true;
      modal.type = "delete";
      selectedProduct.value = value;
    }

    async function deleteProduct() {
      loading.value = true;
      try {
        await productStore.delete(selectedProduct.value.id);
        toast.success("Suppression effectuée avec succès");
        loading.value = false;
        modal.show = false;
        reload.value = reload.value + 1;
      } catch (error: any) {
        toast.error("Suppression impossible");
        loading.value = false;
        modal.show = false;
      }
    }

    const router = useRouter();
    function goToProductCategory() {
      router.push({ name: "categories" });
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
        transform: getVolume,
      },

      {
        title: "Prix/Casier",
        name: "bulkPrice",
        transform: getBulkPrice,
      },
      {
        title: "Date de création",
        name: "createdAt",
        transform: formatDate,
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

    function formatDate(element: IProduct) {
     
        return helpers.formatDate(element.createdAt as any);
    }

    function getVolume(elememnt: IProduct) {
      return `${helpers.currency(elememnt.volume)} CL`;
    }

    function getUnit(element: IProduct) {
      if (element.packagingType == PackagingType.PACK) return "casiers";
      else return "packs";
    }

    function getBulkPrice(element: IProduct) {
      return `${helpers.currency(element.bulkPrice)} F`;
    }

    function getStock(element: IProduct) {
      if (element.stocks && element.stocks[0]) {
        return `${helpers.currency(
          element.stocks[0].currentQuantity
        )} ${getUnit(element)}`;
      } else return 0;
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

    const fileStore = useFileStore();

    const image = ref<File>();

    const loading = ref(false);

    const toast = useToast();

    const reload = ref(0);

    async function onSubmit() {
      try {
       
        if (selectedProduct.value) {
          if (image.value){
            const responseImage = await fileStore.updloadProductImage(
              selectedProduct.value.id,
              image.value as File
            );
          }
           
         
          const response = await productStore.update(
            selectedProduct.value.id,
            product
          );

          toast.success("La boisson a été mise à jour avec succès");
            reload.value = reload.value + 1;
            showModal.value = false;
            router.push({ name: "products" });
          
         
        } else {
         
          
          if (!image.value) toast.error("Vous devez choisir une image");
          else {
            const response = await productStore.create(product);
            await fileStore.updloadProductImage(
              response.data.id,
              image.value as File
            );
            toast.success("La boisson a été crée avec succès");
            reload.value = reload.value + 1;
            showModal.value = false;
            router.push({ name: "products" });
          }
        }

       
      } catch (error: any) {}
    }

    const bulkPriceTitle = computed(() => {
      if (product.packagingType == PackagingType.PACK)
        return "Prix pack (en FCFA)";
      else return "Prix casier (en FCFA)";
    });

    const packagingTypes = computed(() => {
      return [
        {
          title: "Casier",
          value: PackagingType.RACK,
        },
        {
          title: "Pack",
          value: PackagingType.PACK,
        },
      ];
    });

    const packPriceLabel = computed(() => {
      if (product.packagingType == PackagingType.PACK)
        return "Prix du pack (en FCFA)";
      else return "Prix du casier (en FCFA)";
    });

    onMounted(async () => {
      try {
        const response = await productCategoryStore.fetchAll();

        categoryId.value = response.data[0].id;

        categories.value = response.data.map((value: any) => {
          return {
            value: value.id,
            title: value.name,
          };
        });
      } catch (error: any) {}

      const response = await productStore.fetchAll({});

      total.value = response.length;
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
      packagingTypes,
      packPriceLabel,
      image,
      helpers,
      modal,
      deleteProduct,
      reload,
    };
  },
});
</script>

<style scoped></style>
