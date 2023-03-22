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
      <BaseTitle title="Livreurs"></BaseTitle>
      <BaseButton icon="plus" size="small" @click="createUser"
        >Nouveau livreur</BaseButton
      >
    </div>

    <BaseTableWithFilter
      :titles="titles"
      :fetchData="organizationStore.fetchAllDeliveryMen"
      :requestId="organisationId"
      :actions="actions"
      :key="reload"
    >
      <template #filter>
        <div class="flex space-x-4 h-full">
          <BaseButton icon="upload" size="small">Télécharger</BaseButton>
        </div>
      </template>
      <template #status="{ element }">
        <BaseTableStatut
          :title="getStatutLabel(element)"
          :type="getStatutType(element)"
        ></BaseTableStatut>
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
          <Form @submit="onSubmit" class="w-3/4">
            <div class="grid grid-cols-2 gap-6">
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
                name="Date de naissance"
                label="Date de naissance"
                type="date"
                rules="required"
                v-model="user.birthday"
              ></BaseInput>

              <BaseInput
                name="téléphone"
                label="Téléphone"
                rules="required|numeric"
                v-model="user.phone"
              ></BaseInput>
              <BaseInput
                name="firstname"
                label="Email"
                rules="required|email"
                v-model="user.email"
              ></BaseInput>

              <BaseSelect
                name="adresse"
                label="Engin"
                rules="required"
                :items="engines"
                v-model="user.engineId"
              ></BaseSelect>

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
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useUsersStore } from "@/stores/users";
import { Sex, UserRole } from "@/types/enumerations";
import { Form } from "vee-validate";
import { IUser } from "@/types/interfaces";
import { useEnginesStore } from "../../../stores/engines";
import { useOrganizationStore } from "../../../stores/organization";
import BaseTableStatut from "../../../components/base/BaseTableStatut.vue";
import { UserAccountStatus } from "../../../types/enumerations";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { Form, BaseTableStatut },
  setup() {
    const userStore = useUsersStore();

    const actions = [
      {
        title: "Voir détail",
        icon: "eye",
        action: details,
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

    const router = useRouter();
    function details(row: IUser) {
      router.push({
        name: "livreursDetails",
        params: {
          id: row.id,
        },
      });
    }
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
      user.address = value.address;
    }

    function onDelete(value: IUser) {
      selectedUser.value = value;
      modal.title = `Êtes-vous sûr de vouloir <br> supprimer le livreur <br> ${selectedUser.value.name} ?`;
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
          modal.title = `Livreur supprimé avec succès`;
          modal.show = true;
          modal.subtitle = "";
          modal.mode = "success";
        }
      } catch (error) {}
    }

    function onView(value: IUser) {
      selectedUser.value = value;
    }

    const user = reactive<any>({
      name: "",
      phone: "",
      email: "",
      address: "",
      sex: "",
      role: "",
      birthday: null,
      engineId: "",
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

    const showModal = ref(false);

    const titles = [
      {
        title: "Identifiant",
        name: "id",
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
        name: "engine.name",
      },

      {
        title: "Statut",
        name: "status",
      },

      {
        title: "Action",
        name: "action",
      },
    ];

    function getStatutLabel(element: IUser) {
      if (element.status == UserAccountStatus.ACTIVE) return "Active";
      else if (element.status == UserAccountStatus.INACTIVE) return "Inactive";
      else if (element.status == UserAccountStatus.SUSPENDED) return "Suspendu";
    }

    function getStatutType(element: IUser) {
      if (element.status == UserAccountStatus.ACTIVE) return "success";
      else if (element.status == UserAccountStatus.INACTIVE) return "danger";
      else if (element.status == UserAccountStatus.SUSPENDED) return "warning";
    }

    const loading = ref(false);

    const reload = ref(false);

    const engines = ref([]);

    const enginesStore = useEnginesStore();

    onMounted(async () => {
      const response = await enginesStore.fetchAll();

      engines.value = response.map((value: any) => {
        return {
          title: value.name,
          value: value.id,
        };
      });
    });

    const organizationStore = useOrganizationStore();

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    const toast = useToast();

    async function onSubmit() {
      loading.value = true;
      try {
        if (selectedUser.value) {
          const response = await userStore.update(selectedUser.value.id, {
            ...user,
            role: UserRole.DELIVERY_MAN,
          });
          modal.title = `Livreur modifier avec succès`;
        } else {
          const response = await userStore.create({
            ...user,
            role: UserRole.DELIVERY_MAN,
          });
          modal.title = `Livreur créer avec succès`;
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
      engines,
      organizationStore,
      organisationId,
      getStatutLabel,
      getStatutType,
    };
  },
});
</script>

<style scoped></style>
