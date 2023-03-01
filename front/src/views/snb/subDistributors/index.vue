<template>
  <div class="">
    <div class="space-y-6">
      <div class="">
        <BaseTitle title="Sous distributeur"></BaseTitle>
        <!-- Panel -->
        <div class="flex mt-8 space-x-4">
          <div v-for="(etat, index) in etats" :key="index">
            <VPanel
              :labels="etat.name"
              @click="master.type = etat.value"
              :class="{
                'text-white bg-primary': etat.value === master.type,
              }"
            />
          </div>
        </div>
      </div>
      <BaseTableWithFilter
        :titles="titles"
        :fetchData="organizationStore.fetchAllParteners"
        :params="{ type: master.type }"
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
            <BaseButton icon="plus" size="small" @click="createMaster"
              >Nouveau master distribureur</BaseButton
            >
          </div>
        </template>
      </BaseTableWithFilter>
    </div>
    <BaseBottomModal :show="showModal">
      <div class="w-[80%]">
        <div class="border-b pb-2 flex items-center justify-between">
          <div class="font-bold text-2xl">
            {{
              !selectedMaster
                ? "Ajouter un master distributeur"
                : "Mettre à jour"
            }}
          </div>
          <BaseIcon
            name="close"
            class="w-5 h-5"
            @click="showModal = false"
          ></BaseIcon>
        </div>
        <div class="flex justify-center pt-6">
          <Form class="w-3/4 space-y-6" @submit="onSubmit">
            <div class="flex justify-between space-x-6">
              <BaseInput
                name="raison sociale"
                label="Raison Sociale"
                rules="required"
                v-model="master.socialReason"
              ></BaseInput>
              <BaseInput
                name="numéro ifu"
                label="Numéro IFU"
                rules="required"
                v-model="master.fiscalId"
              ></BaseInput>
            </div>
            <div class="flex justify-between space-x-6">
              <BaseInput
                name="téléphone"
                label="Téléphone"
                rules="required"
                v-model="master.phone"
              ></BaseInput>
              <BaseInput
                name="firstname"
                label="Email"
                rules="required"
                v-model="master.email"
              ></BaseInput>
            </div>
            <div class="flex justify-between space-x-6">
              <BaseInput
                name="Nom du représentant"
                label="Nom du représentant"
                rules="required"
                v-model="master.ownerName"
              ></BaseInput>
              <BaseInput
                name="adresse"
                label="Adresse"
                rules="required"
                v-model="master.adress"
              ></BaseInput>
            </div>

            <div class="text-[#0F0F14]">Méthode de paiement</div>
            <div class="flex items-center space-x-6">
              <div
                class="flex items-center space-x-2"
                v-for="method in paymentMethods"
                :key="method.title"
              >
                <BaseSelectedCard
                  :selected="master.paymentDeadline == method.value"
                  @click="master.paymentDeadline = +method.value"
                >
                  <BaseIcon :name="method.icon"></BaseIcon>
                </BaseSelectedCard>
                <div class="text-[14px] font-semibold">{{ method.title }}</div>
              </div>
            </div>

            <BaseButton class="w-[200px]" :loading="loading">{{
              selectedMaster ? "Mettre à jour" : "Ajouter"
            }}</BaseButton>
          </Form>
        </div>
      </div>
    </BaseBottomModal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { useOrganizationStore } from "@/stores/organization";
import { Form } from "vee-validate";
import { IOrganisation } from "@/types/interfaces";
import VPanel from "@/components/VPanel.vue";
import { useUsersStore } from "../../../stores/users";
import { OrganisationType } from "../../../types/enumerations";
import { PrimaryKey } from "../../../types/interfaces";

export default defineComponent({
  components: { Form, VPanel },
  setup() {
    const etats = ref([
      { name: "Master distributeur", value: OrganisationType.MD },
      { name: "Distributeurs agréés", value: OrganisationType.DA },
      //{ name: "Dépots", value: OrganisationType.DA },
    ]);

    const paymentMethods = ref([
      {
        title: "Paiment à la commande",
        icon: "cash",
        value: 0,
      },
      {
        title: "Paiment sur 30 jours",
        icon: "calendar",
        value: 30,
      },
      {
        title: "Paiment sur 60 jours",
        icon: "calendar",
        value: 60,
      },
      {
        title: "Paiment sur 90 jours",
        icon: "calendar",
        value: 90,
      },
    ]);

    const active = ref(0);

    const organizationStore = useOrganizationStore();

    const userStore = useUsersStore();

    const actions = [
      //   {
      //     title: "Voir détail",
      //     icon: "eye",
      //     action: onView,
      //   },
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

    const selectedMaster = ref<IOrganisation | null>();

    function createMaster() {
      selectedMaster.value = null;
      showModal.value = true;
      master.ownerName = "";
      master.phone = "";
      master.email = "";
      master.adress = "";
      master.fiscalId = "";
      master.socialReason = "";
    }

    function onUpdate(value: IOrganisation) {
      selectedMaster.value = value;
      showModal.value = true;
      master.ownerName = value.ownerName;
      master.phone = value.phone;
      master.email = value.email;
      master.fiscalId = value.fiscalId;
      master.adress = value.adress;
      master.socialReason = value.socialReason;
    }

    function onDelete(value: IOrganisation) {
      selectedMaster.value = value;
      modal.title = `Êtes-vous sûr de vouloir <br> supprimer l’utilisateur <br> ${selectedMaster.value.name} ?`;
      modal.show = true;
      modal.subtitle = "";
      modal.mode = "confirm";
      modal.type = "delete";
    }

    async function deleteMaster() {
      try {
        if (selectedMaster.value) {
          const response = await organizationStore.delete(
            selectedMaster.value.id
          );
          reload.value = !reload.value;
          modal.title = `Organisation supprimé avec succès`;
          modal.show = true;
          modal.subtitle = "";
          modal.mode = "success";
        }
      } catch (error) {}
    }

    function onView(value: IOrganisation) {
      selectedMaster.value = value;
    }

    const master = reactive({
      type: OrganisationType.MD,
      fiscalId: "",
      phone: "",
      email: "",
      adress: "",
      paymentDeadline: 0,
      socialReason: "",
      ownerName: "",
    });

    const showModal = ref(false);

    const titles = [
      {
        title: "Nom d'utilisateur",
        name: "name",
      },
      {
        title: "Téléphone",
        name: "phone",
      },
      {
        title: "Email",
        name: "email",
      },

      {
        title: "Commandes",
        name: "commandes",
      },
      {
        title: "Chiffre d’affaire",
        name: "chiffre d’affaire",
      },
      {
        title: "Statut",
        name: "statut",
      },

      {
        title: "Action",
        name: "action",
      },
    ];

    const loading = ref(false);

    const reload = ref(false);

    async function onSubmit() {
      loading.value = true;

      try {
        if (selectedMaster.value) {
          const response = await organizationStore.update(
            selectedMaster.value.id,
            master
          );
          modal.title = `Organisation modifié avec succès`;
        } else {
          const response = await organizationStore.create(master);
          modal.title = `Organisation crée avec succès`;
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
      organizationStore,
      titles,
      showModal,
      master,
      onSubmit,
      actions,
      selectedMaster,
      createMaster,
      modal,
      deleteMaster,
      loading,
      reload,
      etats,
      active,
      paymentMethods,
      userStore,
    };
  },
});
</script>
<style scoped></style>
