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
              @click="select(index)"
              :class="{
                'text-white bg-green': index === active,
              }"
            />
          </div>
        </div>
      </div>
      {{ masterStore.getCurrentMaster?.organisationId }}
      <BaseTableWithFilter
        :titles="titles"
        :fetchData="masterStore.fetchByOrganization"
        :requestId="masterStore.getCurrentMaster?.organizationId"
        :actions="actions"
        :key="reload"
      >
        <template #filter>
          <div class="flex space-x-4 h-full">
            <div
              class="
                flex
                border
                rounded
                items-center
                justify-center
                px-4
                font-semibold
                space-x-2
              "
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
                v-model="master.company"
              ></BaseInput>
              <BaseInput
                name="numéro ifu"
                label="Numéro IFU"
                rules="required"
                v-model="master.ifu"
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
                label="nom du représentant"
                rules="required"
                v-model="master.name"
              ></BaseInput>
              <BaseInput
                name="adresse"
                label="Adresse"
                rules="required"
                v-model="master.address"
              ></BaseInput>
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
import { useMasterStore } from "@/stores/parteners/master";
import { Form } from "vee-validate";
import { IMaster } from "@/types/interfaces";
import VPanel from "@/components/VPanel.vue";

export default defineComponent({
  components: { Form, VPanel },
  setup() {
    const etats = ref([
      { name: "Master distributeur" },
      { name: "Distributeurs agréés" },
      { name: "Dépots" },
    ]);
    const active = ref(0);
    function select(i: number) {
      active.value = i;
    }

    const masterStore = useMasterStore();

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

    const selectedMaster = ref<IMaster | null>();

    function createMaster() {
      selectedMaster.value = null;
      showModal.value = true;
      master.name = "";
      master.phone = "";
      master.email = "";
      master.address = "";
      master.ifu = "";
      master.company = "";
    }

    function onUpdate(value: IMaster) {
      selectedMaster.value = value;
      showModal.value = true;
      master.name = value.name;
      master.phone = value.phone;
      master.email = value.email;
      master.ifu = value.ifu;
      master.address = value.address;
      master.company = value.company;
    }

    function onDelete(value: IMaster) {
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
          const response = await masterStore.delete(selectedMaster.value.id);
          reload.value = !reload.value;
          modal.title = `Utilisateur supprimé avec succès`;
          modal.show = true;
          modal.subtitle = "";
          modal.mode = "success";
        }
      } catch (error) {}
    }

    function onView(value: IMaster) {
      selectedMaster.value = value;
    }

    const master = reactive({
      name: "",
      phone: "",
      email: "",
      address: "",
      ifu: "",
      company: "",
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
          const response = await masterStore.update(
            selectedMaster.value.id,
            master
          );
          modal.title = `Utilisateur modifié avec succès`;
        } else {
          const response = await masterStore.create(master);
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
      masterStore,
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
      select,
      active,
    };
  },
});
</script>
<style scoped></style>
