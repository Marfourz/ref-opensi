<template>
  <div class="space-y-6">
    <!-- <BaseModal :show="modal.show">
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
            <BaseIcon name="check" class="w-8 h-8 text-white"></BaseIcon>
          </div>
          <div class="font-bold text-2xl">
            {{ modal.title }}
          </div>
          <BaseButton class="w-full" @click="modal.show = false"
            >Terminer</BaseButton
          >
        </div>
      </template>
    </BaseModal> -->
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
              :bgColor="
                selectedUser?.status === UserAccountStatus.ACTIVE
                  ? 'danger'
                  : 'primary'
              "
              :outline="true"
              class="w-1/2"
              @click="modal.show = false"
            >
              Annuler
            </BaseButton>
            <BaseButton
              :bgColor="
                selectedUser?.status === UserAccountStatus.ACTIVE
                  ? 'danger'
                  : 'primary'
              "
              class="w-1/2"
              @click="toogleStatus"
            >
              {{ toggleText }}
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
            <BaseIcon name="check" class="w-8 h-8 text-white"></BaseIcon>
          </div>
          <div class="font-bold text-2xl">
            {{ modal.title }}
          </div>
          <BaseButton class="w-full" @click="modal.show = false"
            >Terminer</BaseButton
          >
        </div>
      </template>
    </BaseModal>

    <div class="flex items-center space-x-6">
      <BaseTitle title="Utilisateurs"></BaseTitle>
      <BaseButton icon="plus" size="small" @click="createUser"
        >Nouveau utilisateur</BaseButton
      >
    </div>
    <BaseTableWithFilter
      :titles="titles"
      :fetchData="userStore.fetchByOrganization"
      :downloadData="userStore.downloadUsers"
      :requestId="organisationId"
    
      :key="reload"
    >
    <template #name="{element}">
      <div>
          {{ element.name + " " + element.firstName }}
      </div>
    </template>
  <template #action="{ element }">
          <BaseActions :actions="customActions(element)" :data="element" />
        </template>
  </BaseTableWithFilter>

    <BaseBottomModal :show="showModal">
      <div class="w-[80%]">
        <div class="border-b pb-2 flex items-center justify-between">
          <div class="font-bold text-2xl">
            {{ !selectedUser ? "Ajouter un utilisateur" : "Mettre à jour" }}
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
              name="nom d'utilisateur"
              label="Nom"
              rules="required"
              v-model="user.name"
            ></BaseInput>
            <BaseInput
              name="prénom"
              label="Prénom"
              rules="required"
              v-model="user.firstName"
            ></BaseInput>
            <BaseInput
              name="téléphone"
              label="Téléphone"
              rules="required"
              v-model="user.phone"
            ></BaseInput>
            <BaseInput
              name="Email"
              label="Email"
              rules="required|email"
              v-model="user.email"
            ></BaseInput>
            <BaseSelect
              label="Sexe"
              :items="sexes"
              v-model="user.sex"
            ></BaseSelect>
            <BaseSelect
              label="Rôle"
              :items="roles"
              v-model="user.role"
            ></BaseSelect>
            <BaseButton class="w-[200px]" :loading="loading">{{
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
import { useUsersStore } from "../../stores/users";
import { Sex, UserRole } from "../../types/enumerations";
import { Form } from "vee-validate";
import { IUser } from "../../types/interfaces";
import { useToast } from "vue-toastification";
import { IAction } from "@/types/interfaces";
import { UserAccountStatus } from "../../types/enumerations";

export default defineComponent({
  components: { Form },
  setup() {
    // const actions = [
    //   //   {
    //   //     title: "Voir détail",
    //   //     icon: "eye",
    //   //     action: onView,
    //   //   },
    //   {
    //     title: "Modifier",
    //     icon: "edit",
    //     action: onUpdate,
    //   },
    //   {
    //     title: "Supprimer",
    //     icon: "removeRed",
    //     action: onDelete,
    //   },
    // ];
    const userStore = useUsersStore();

    const customActions: (el: { status: string }) => IAction[] = (el: {
      status: string;
    }) => {
      const actions = [
        {
          title: "Modifier",
          icon: "editfine",
          action: onUpdate,
        },
      ];
      if (el.status === UserAccountStatus.ACTIVE) {
        actions.push({
          title: "Désactiver",
          icon: "cancel",
          action: onToggle,
        });
        return actions;
      }
      actions.push({
        title: "Activer",
        icon: "yes",
        action: onToggle,
      });
      return actions;
    };

    function onToggle(value: IUser) {
      selectedUser.value = value;
      if (value.status === UserAccountStatus.ACTIVE)
        modal.title = `Êtes-vous sûr de vouloir désactiver ${selectedUser.value.name} ?`;
      if (value.status === UserAccountStatus.INACTIVE)
        modal.title = `Êtes-vous sûr de vouloir activer ${selectedUser.value.name} ?`;
      modal.show = true;
      modal.subtitle = "";
      modal.mode = "confirm";
      modal.type = "delete";
    }

    
    async function toogleStatus(value: IUser) {
      try {
        if (selectedUser.value?.status === UserAccountStatus.ACTIVE) {
     

          const response = await userStore.update(selectedUser.value?.id, {
            status: UserAccountStatus.INACTIVE,
          });
          modal.title = `${selectedUser.value?.name}  désactivé avec succès`;
        } else {
          const response = await userStore.update(selectedUser.value?.id, {
            status: UserAccountStatus.ACTIVE,
          });
          modal.title = `${selectedUser.value?.name} activé avec succès`;
        }

        reload.value = !reload.value;
        modal.show = true;
        modal.subtitle = "";
        modal.mode = "success";
      } catch (error) {}
    }

    const toggleText = computed(() => {
      if (selectedUser.value?.status === UserAccountStatus.ACTIVE)
        return "Désactiver";
      else return "Activer";
    });
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
      user.firstName = ""
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
      user.firstName = value.firstName
      user.phone = value.phone;
      user.email = value.email;
      user.sex = value.sex;
      user.role = value.role;
    }

    function onDelete(value: IUser) {
      selectedUser.value = value;
      modal.title = "Confirmez-vous la suppression de l'utilisateur ?";
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
      firstName:"",
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
          value: Sex.male,
        },
        {
          title: "Femme",
          value: Sex.female,
        },
        {
          title: "Autre",
          value: Sex.others,
        },
      ];
    });

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    const roles = computed(() => {
      return [
        {
          title: "Administrateur",
          value: UserRole.ADMIN,
        },
        // {
        //   title: "Livreur",
        //   value: UserRole.DELIVERY_MAN,
        // },
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
        title: "Nom d'utilisateur",
        name: "name",
      },
      {
        title: "Email",
        name: "email",
      },
      {
        title: "Téléphone",
        name: "phone",
      },
      {
        title: "Rôle",
        name: "role",
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

    const toast = useToast();

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
        toast.error(error.response.data.message);
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
      // actions,
      selectedUser,
      createUser,
      modal,
      deleteUser,
      loading,
      reload,
      organisationId,
      UserAccountStatus,
      toggleText,
      toogleStatus,
      customActions,
    };
  },
});
</script>

<style scoped></style>
