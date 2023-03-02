<template>
  <div class="space-y-8">
    <BaseModal
      :title="modal.title"
      :show="modal.show"
      @close="modal.show = false"
    >
    <Form @submit="onSubmit" class="space-y-6" v-if="modal.mode == 'confirm'">
          <BaseInput
            name="Nom"
            rules="required"
            v-model="category.name"
            label="Nom de la catégorie"
          ></BaseInput>
          <BaseInput
            name="description"
            v-model="category.description"
            type="textarea"
            label="Description"
          ></BaseInput>
          <BaseButton class="w-full" :loading="loading">{{
            modal.type == "create" ? "Ajouter" : "Modifier"
          }}</BaseButton>
        </Form>
        <template #modal >
        <div class="flex flex-col space-y-6 items-center py-4" v-if="modal.mode == 'success'">
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center bg-success text-white"
          >
            <BaseIcon name="check text-white" class="w-8 h-8"></BaseIcon>
          </div>
          <div class="font-bold text-2xl text-center" v-html="modal.title">
         
          </div>
          <BaseButton class="w-full" @click="modal.show = false"
            >Terminé</BaseButton
          >
        </div>
      </template>
     
    </BaseModal>
    <BaseGoBack></BaseGoBack>
    <div class="flex items-center space-x-6">
      <BaseTitle title="Listes des catégories"></BaseTitle>
      <BaseButton icon="plus" size="small" @click="createCategory"
        >Nouvelle catégorie
      </BaseButton>
    </div>
    <!-- <div class="px-8 pt-12" v-show="total == 0">
      <EmptyState
        title="Vos catégories ajoutés seront visibles ici. <br> Cliquez sur le bouton Nouvelle catégorie <br> pour ajouter des catégories"
        image="/src/assets/images/emptyProduct.png"
      ></EmptyState>
    </div> -->

    <BaseTableWithFilter
     
      :fetchData="productCategoryStore.fetchAll"
      :titles="titles"
      :actions="actions"
      @total="total = $event"
      :key="reload"
    ></BaseTableWithFilter>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useProductCategoryStore } from "../../../stores/product-category";
import EmptyState from "../../../components/EmptyState.vue";
import { Form } from "vee-validate";
import { IProductCategory } from "../../../types/interfaces";

export default defineComponent({
  components: { EmptyState, Form },
  setup() {
    const productCategoryStore = useProductCategoryStore();
    const category = reactive({
      name: "",
      description: "",
    });
    const actions = [
     
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

   

    function onUpdate(value: IProductCategory) {
      selectedCategory.value = value;
      category.name = value.name;
      category.description = value.description;
      modal.show = true;
      modal.mode = "confirm";
      modal.type = "update";
      modal.title = "Modifier la catégorie";
    }

    function onDelete() {}

    const selectedCategory = ref();

    function createCategory() {
      modal.title = "Nouvelle catégorie";
      modal.show = true;
      modal.mode = "confirm";
      modal.type = "create";
      category.name = ""
      category.description = ""
    }

    const loading = ref(false);

    const reload = ref(false)

    async function onSubmit() {
      loading.value = true;
      try {
        if (!selectedCategory.value) {
          const response = await productCategoryStore.create(category);
          modal.title = "Catégorie ajoutée avec succès ! ";
        } else {
          const response = await productCategoryStore.update(
            selectedCategory.value.id,
            category
          );
          modal.title = "Catégorie mise à jour avec <br> succès ! ";
        }

        reload.value = !reload.value
        modal.show = true;
        modal.mode = "success";
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    }

    const titles = [
      {
        title: "Nom de la catégorie",
        name: "name",
      },

      {
        title: "Description",
        name: "description",
      },
      {
        title: "Action",
        name: "action",
      },
    ];

    const modal = reactive({
      title: "",
      type: "create" as "create" | "delete" | "update",
      show: false,
      mode: "confirm" as "confirm" | "success",
    });

    const total = ref(0);
    return {
      actions,
      titles,
      total,
      productCategoryStore,
      modal,
      category,
      onSubmit,
      createCategory,
      loading,
      reload
    };
  },
});
</script>

<style scoped></style>
