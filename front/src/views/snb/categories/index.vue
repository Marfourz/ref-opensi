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
      <template #modal>
        <div
          class="flex flex-col space-y-6 items-center py-4"
          v-if="modal.mode == 'success'"
        >
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center bg-success text-white"
          >
            <BaseIcon name="check" class="w-8 h-8 text-white"></BaseIcon>
          </div>
          <div
            class="font-bold text-2xl text-center"
            v-html="modal.title"
          ></div>
          <BaseButton class="w-full" @click="modal.show = false"
            >Terminer</BaseButton
          >
        </div>

        <div
          class="flex flex-col space-y-6 items-center py-4"
          v-if="modal.mode == 'confirm' && modal.type == 'delete'"
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
              @click="deleteCategory"
            >
              Supprimer
            </BaseButton>
          </div>
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
        image="@/assets/images/emptyProduct.png"
      ></EmptyState>
    </div> -->

    <BaseTableWithFilter
      :fetchData="productCategoryStore.fetchAll"
      :titles="titles"
      :actions="actions"
      @total="total = $event"
      :key="reload"
      :downloadData="productCategoryStore.downloadCategories"
    >
      <template #description="{ element }">
        <div>
          {{ element.description ? element.description : "Aucune" }}
        </div>
      </template>
    </BaseTableWithFilter>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useProductCategoryStore } from "../../../stores/product-category";
import EmptyState from "../../../components/EmptyState.vue";
import { Form } from "vee-validate";
import { IProductCategory } from "../../../types/interfaces";
import { useToast } from "vue-toastification";

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

    function onDelete(value: IProductCategory) {
      modal.title = `Êtes-vous sûr de vouloir <br> supprimer la catégorie <br> ${value.name} ?`;
      modal.show = true;
      modal.mode = "confirm";
      modal.type = "delete";
      selectedCategory.value = value;
    }

    const selectedCategory = ref();

    function createCategory() {
      modal.title = "Nouvelle catégorie";
      modal.show = true;
      modal.mode = "confirm";
      modal.type = "create";
      category.name = "";
      category.description = "";
      selectedCategory.value = null;
    }

    const loading = ref(false);

    const reload = ref(false);

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

        reload.value = !reload.value;
        modal.show = true;
        modal.mode = "success";
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    }

    const toast = useToast();

    async function deleteCategory() {
      loading.value = true;
      try {
        await productCategoryStore.delete(selectedCategory.value.id);
        toast.success("Suppression effectuée avec  succès");
        loading.value = false;
        modal.show = false;
        reload.value = !reload.value;
      } catch (error: any) {
        toast.error("Suppression impossible");
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
      reload,
      deleteCategory,
    };
  },
});
</script>

<style scoped></style>
