<template>
    <div class="space-y-6">
      <BaseModal :show="modal.show">
        <template #modal>
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
                class="w-1/2 bg-danger"
                @click="deleteUser"
              >
                Supprimer
              </BaseButton>
            </div>
          </div>
  
          <div
            class="flex flex-col space-y-6 items-center py-4"
            v-else-if="(modal.mode = 'success')"
          >
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center bg-success text-white"
            >
              <BaseIcon name="check" class="w-8 h-8"></BaseIcon>
            </div>
            <div class="font-bold text-2xl">
              {{ modal.title }}
            </div>
            <BaseButton class="w-full" @click="modal.show = false"
              >Terminé</BaseButton
            >
          </div>
        </template>
      </BaseModal>
  
      <div class="flex items-center space-x-6">
        <BaseTitle title="Livreurs"></BaseTitle>
        <BaseButton icon="plus" size="small" @click="createUser"
          >Nouveau livreur</BaseButton
        >
      </div>
  
    
      <BaseTableWithFilter
        :titles="titles"
        :fetchData="userStore.fetchByOrganization"
        :requestId="userStore.getCurrentUser?.organizationId"
        :actions="actions"
        :key="reload"
      >
        <template #filter>
          <div class="flex space-x-4 h-full">
            <div
              class="flex border rounded items-center justify-center px-4 font-semibold space-x-2"
            >
              <div>Filtré par</div>
              <BaseIcon name="simpleArrowBottom"></BaseIcon>
            </div>
  
            <BaseButton icon="upload" size="small">Télécharger</BaseButton>
          </div>
        </template>
      </BaseTableWithFilter>
  
      <BaseBottomModal :show="showModal">
        <div class="w-[80%]">
          <div class="border-b pb-2 flex items-center justify-between">
            <div class="font-bold text-2xl">
              {{ !selectedUser ? "Ajouter un livreur" : "Mettre à jour" }}
            </div>
            <BaseIcon
              name="close"
              class="w-5 h-5"
              @click="showModal = false"
            ></BaseIcon>
          </div>
          <div class="flex justify-center pt-6">
            <Form  @submit="onSubmit" class="w-3/4">
                <div class=" grid grid-cols-2 gap-4">
                    <BaseInput
                name="nom d'utilisateur"
                label="Nom d'utilisateur"
                rules="required"
                v-model="user.name"
              ></BaseInput>
                
              <BaseSelect
                label="Sexe"
                :items="sexes"
                v-model="user.sex"
              ></BaseSelect>

              <BaseInput
                name="téléphone"
                label="Téléphone"
                rules="required"
                v-model="user.phone"
              ></BaseInput>
              <BaseInput
                name="firstname"
                label="Email"
                rules="required"
                v-model="user.email"
              ></BaseInput>
             
              <BaseInput
                name="adresse"
                label="Adresse"
                rules="required"
                v-model="user.address"
              ></BaseInput>

              <BaseInput
                name="adresse"
                label="Adresse"
                rules="required"
                v-model="user.address"
              ></BaseInput>

              <BaseInput
                name="adresse"
                label="Adresse"
                rules="required"
                v-model="user.address"
              ></BaseInput>

              <BaseInput
                name="adresse"
                label="Adresse"
                rules="required"
                v-model="user.address"
              ></BaseInput>
                </div>
              
              <BaseButton class="w-[200px] mt-6" :loading="loading">{{
                selectedUser ? "Mettre à jour" : "Ajouter"
              }}</BaseButton>
            </Form>
          </div>
        </div>
      </BaseBottomModal>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, defineComponent, reactive, ref } from "vue";
  import { useUsersStore } from "@/stores/users";
  import { Sex, UserRole } from "@/types/enumerations";
  import { Form } from "vee-validate";
  import { IUser } from "@/types/interfaces";
  
  export default defineComponent({
    components: { Form },
    setup() {
      const userStore = useUsersStore();
  
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
  
      const modal = reactive({
        title: "",
        subtitle: "",
        type: "create" as "create" | "delete" | "update",
        show: false,
        mode: "confirm" as "confirm" | "success",
      });
  
      const selectedUser = ref<IUser | null>();
  
      function createUser() {
        selectedUser.value = null;
        showModal.value = true;
        user.name = "";
        user.phone = "";
        user.email = "";
        user.address = "";
        user.sex = "";
        user.role = "";
      }
  
      function onUpdate(value: IUser) {
        selectedUser.value = value;
        showModal.value = true;
        user.name = value.name;
        user.phone = value.phone;
        user.email = value.email;
        user.sex = value.sex;
        user.role = value.role;
      }
  
      function onDelete(value: IUser) {
        selectedUser.value = value;
        modal.title = `Êtes-vous sûr de vouloir <br> supprimer l’utilisateur <br> ${selectedUser.value.name} ?`;
        modal.show = true;
        modal.subtitle = "";
        modal.mode = "confirm";
        modal.type = "delete";
      }
  
      async function deleteUser() {
        try {
          if (selectedUser.value) {
            const response = await userStore.delete(selectedUser.value.id);
            reload.value = !reload.value;
            modal.title = `Utilisateur supprimé avec succès`;
            modal.show = true;
            modal.subtitle = "";
            modal.mode = "success";
          }
        } catch (error) {}
      }
  
      function onView(value: IUser) {
        selectedUser.value = value;
      }
  
      const user = reactive({
        name: "",
        phone: "",
        email: "",
        address: "",
        sex: "",
        role: "",
      });
  
      const sexes = computed(() => {
        return [
          {
            title: "Homme",
            value: Sex.MALE,
          },
          {
            title: "Femme",
            value: Sex.FEMALE,
          },
          {
            title: "Autre",
            value: Sex.OTHERS,
          },
        ];
      });
  
      const roles = computed(() => {
        return [
          {
            title: "Administrateur",
            value: UserRole.ADMIN,
          },
          {
            title: "Livreur",
            value: UserRole.DELIVERY_MAN,
          },
          {
            title: "Super administrateur",
            value: UserRole.SUPER_USER,
          },
          {
            title: "Commercial",
            value: UserRole.COMMERCIAL,
          },
        ];
      });
  
      const showModal = ref(false);
  
      const titles = [
      {
          title: "Identifiant",
          name: "name",
        },
        {
          title: "Nom & Prénoms",
          name: "name",
        },

      
        {
          title: "Téléphone",
          name: "phone",
        },
        {
          title: "Engin",
          name: "engin",
          transform: getRoleLabel,
        },

        {
          title: "Statut",
          name: "statut",
          transform: getRoleLabel,
        },
  
        {
          title: "Action",
          name: "action",
        },
      ];
  
      function getRoleLabel(element: any, index: number) {
        const labels = [
          {
            code: UserRole.ADMIN,
            label: "Administrateur",
          },
          {
            code: UserRole.DELIVERY_MAN,
            label: "Livreur",
          },
          {
            code: UserRole.COMMERCIAL,
            label: "Commercial",
          },
          {
            code: UserRole.SUPER_USER,
            label: "Super administrateur",
          },
        ];
  
        return labels.find((value: any) => value.code == element.role)?.label;
      }
  
      const loading = ref(false);
  
      const reload = ref(false);
  
      async function onSubmit() {
        loading.value = true;
  
        try {
          if (selectedUser.value) {
            const response = await userStore.update(selectedUser.value.id, user);
            modal.title = `Utilisateur modifié avec succès`;
          } else {
            const response = await userStore.create(user);
            modal.title = `Utilisateur crée avec succès`;
          }
          modal.show = true;
          modal.subtitle = "";
          modal.mode = "success";
          showModal.value = false;
          loading.value = false;
          reload.value = !reload.value;
        } catch (error: any) {
          loading.value = false;
        }
      }
  
      return {
        userStore,
        titles,
        showModal,
        roles,
        sexes,
        user,
        onSubmit,
        actions,
        selectedUser,
        createUser,
        modal,
        deleteUser,
        loading,
        reload,
      };
    },
  });
  </script>
  
  <style scoped></style>
  