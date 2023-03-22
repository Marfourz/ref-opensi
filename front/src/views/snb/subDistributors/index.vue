<template>
  <div class="">
    <div class="space-y-6 flex flex-col h-full">
      <div class="">
        <BaseTitle title="Partenaires"></BaseTitle>
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
        class="flex flex-col flex-1"
        :titles="titles"
        :fetchData="organizationStore.fetchAllParteners"
        :params="{ type: master.type }"
        :actions="actions"
        :requestId="organisationId"
        :key="reload"
      >
        <template #filter>
          <div class="flex space-x-4 h-full">
            <BaseButton icon="upload" size="small">Télécharger</BaseButton>
            <BaseButton
              icon="plus"
              size="small"
              @click="createMaster"
              v-if="showNewSubDistributor"
              >Nouveau {{ partenaireTitle }}</BaseButton
            >
          </div>
        </template>
        <template #status="{ element }">
          <BaseTableStatut
            :title="getStatutLabel(element)"
            :type="getStatutType(element)"
          ></BaseTableStatut>
        </template>

        <template #action="{ element }">
          
          <BaseActions :actions="customActions(element)" :data="element" />
        </template>
        <template #wallet="{ element }">
          <div>{{ element.wallet.turnover }} FCFA</div>
        </template>
      </BaseTableWithFilter>
    </div>
    <BaseBottomModal :show="showModal">
      <div class="w-[80%]">
        <div class="border-b pb-2 flex items-center justify-between">
          <div class="font-bold text-2xl">
            {{
              !selectedMaster
                ? `Ajouter un ${partenaireTitle}`
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
              >
              </BaseInput>
              <BaseInput
                name="numéro ifu"
                label="Numéro IFU"
                rules="required|min:10|max:13|numeric"
                v-model="master.fiscalId"
              ></BaseInput>
            </div>
            <div class="flex justify-between space-x-6">
              <BaseInput
                name="téléphone"
                label="Téléphone"
                rules="numeric|required"
                v-model="master.phone"
              ></BaseInput>
              <BaseInput
                name="firstname"
                label="Email"
                rules="required|email"
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
                class="flex items-center space-x-2 cursor-pointer"
                v-for="method in paymentMethods"
                :key="method.title"
                @click="master.paymentDeadline = +method.value"
              >
                <BaseSelectedCard
                  :selected="master.paymentDeadline == method.value"
                  
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
import { IAction, IOrganisation } from "@/types/interfaces";
import VPanel from "@/components/VPanel.vue";
import { useUsersStore } from "../../../stores/users";
import {
  OrganisationType,
  UserAccountStatus,
} from "../../../types/enumerations";
import { PrimaryKey } from "../../../types/interfaces";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import BaseActions from "../../../components/base/BaseActions.vue";

export default defineComponent({
  components: { Form, VPanel,BaseActions },
  setup() {
    const etats = computed(() => {
      const items = [{ name: "Dépots", value: OrganisationType.DP }];

      if (organisationType.value == OrganisationType.MD || organisationType.value == OrganisationType.SNB){
        master.type = OrganisationType.DA
        items.unshift({
          name: "Distributeurs agréés",
          value: OrganisationType.DA,
        });
      }
       
      if (organisationType.value == OrganisationType.SNB){
        master.type = OrganisationType.MD
        items.unshift({
          name: "Masters distributeurs",
          value: OrganisationType.MD,
        });
      }
       

      return items
    });

    const paymentMethods = ref([
      {
        title: "Paiment à la commande",
        icon: "cash",
        value: 0,
      },
      {
        title: "Paiment sur 30 jours",
        icon: "calendar30",
        value: 30,
      },
      {
        title: "Paiment sur 60 jours",
        icon: "calendar60",
        value: 60,
      },
      {
        title: "Paiment sur 90 jours",
        icon: "calendar90",
        value: 90,
      },
    ]);

    const active = ref(0);

    const organizationStore = useOrganizationStore();

    const userStore = useUsersStore();

    const customActions: (el: { status: string }) => IAction[] = (el: {
      status: string;
    }) => {
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
      ];
      if (el.status === "active") {
        actions.push({
          title: "Désactiver",
          icon: "removeRedd",
          action: onDelete,
        });
        return actions;
      }
      actions.push({
        title: "Activer",
        icon: "removeRedd",
        action: onDelete,
      });
      return actions;
    };

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
    const router = useRouter();
    function details(row: IOrganisation) {
      router.push({
        name: "sousDistributeursDetails",
        params: {
          id: row.id,
        },
      });
    }

    const partenaireTitle = computed(() => {
      if (master.type == OrganisationType.DA) return "distributeur agrée";
      else if (master.type == OrganisationType.DP) return "dépôt";
      else return "master distributeur";
    });

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
        name: "ownerName",
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
        transform: getTotalOrder,
      },
      {
        title: "Chiffre d’affaires",
        name: "wallet",
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

    function getTotalOrder(element: IOrganisation) {
      if (element.orders) return element.orders.length;
      return 0;
    }

    function getStatutLabel(element: IOrganisation) {
      if (element.status == UserAccountStatus.ACTIVE) return "Actif";
      else if (element.status == UserAccountStatus.INACTIVE) return "Inactif";
      else if (element.status == UserAccountStatus.SUSPENDED) return "Suspendu";
    }

    function getStatutType(element: IOrganisation) {
      if (element.status == UserAccountStatus.ACTIVE) return "success";
      else if (element.status == UserAccountStatus.INACTIVE) return "danger";
      else if (element.status == UserAccountStatus.SUSPENDED) return "warning";
    }

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });
    const loading = ref(false);

    const reload = ref(false);

    const toast = useToast();

    async function onSubmit() {
      loading.value = true;

      try {
        if (selectedMaster.value) {
          const response = await organizationStore.update(
            selectedMaster.value.id,
            master
          );
          modal.title = `Organisation modifié avec succès`;
          toast.success("Partenaire modifié avec succès")
        } else {
          const response = await organizationStore.create({
            ...master,
            parentOrganisationId: organisationId.value,
          });
          modal.title = `Organisation crée avec succès`;
          toast.success("Partenaire crée avec succès")
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

    const organisationType = computed(() => {
      if (userStore.getCurrentUser?.organisation)
        return userStore.getCurrentUser?.organisation.type;
    });

    const showNewSubDistributor = computed(() => {
      if (master.type == OrganisationType.MD) {
        if (organisationType.value == OrganisationType.SNB) return true;
        return false;
      } else if (master.type == OrganisationType.DA) {
        if (organisationType.value == OrganisationType.MD) return true;
        return false;
      } else if (master.type == OrganisationType.DP) {
        if (organisationType.value == OrganisationType.DA) return true;
        return false;
      }
    });

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
      getStatutLabel,
      getStatutType,
      partenaireTitle,
      details,
      organisationId,
      customActions,
      showNewSubDistributor,
    };
  },
});
</script>
<style scoped></style>
