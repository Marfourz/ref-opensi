<template>
  <div class="">
    <div class="space-y-6 flex flex-col h-full">
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
                :bgColor="
                  selectedMaster?.status === UserAccountStatus.ACTIVE
                    ? 'primary'
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
                  selectedMaster?.status === UserAccountStatus.ACTIVE
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
                  selectedMaster?.status === UserAccountStatus.ACTIVE
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
                  selectedMaster?.status === UserAccountStatus.ACTIVE
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
            <div class="font-bold text-2xl text-center">
              {{ modal.title }}
            </div>
            <BaseButton class="w-full" @click="modal.show = false"
              >Terminer</BaseButton
            >
          </div>
        </template>
      </BaseModal>
      <div class="">
        <div class="flex justify-between">
          <BaseTitle title="Partenaires"></BaseTitle>
          <BaseButton
              icon="plus"
              size="small"
              class=" md:hidden"
              @click="createMaster"
              v-if="showNewSubDistributor"
              >Nouveau </BaseButton
            >
        </div>
        
        <!-- Panel -->
        <div class="flex mt-8 space-x-4 w-full overflow-scroll">
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
        :mobileTitles="mobileTitles"
        :fetchData="organizationStore.fetchAllParteners"
        :params="{ type: master.type }"
        :actions="actions"
        :requestId="organisationId"
        :key="reload"
        :emptyMessage="emptyMessage"
        :downloadData="organizationStore.downloadPartners"
      >
        <template #filters>
<<<<<<< HEAD
          <BaseButton
            icon="plus"
            size="small"
            @click="createMaster"
            v-if="showNewSubDistributor"
            >Nouveau {{ partenaireTitle }}</BaseButton
          >
=======
            <BaseButton
              icon="plus"
              size="small"
              class="hidden md:block"
              @click="createMaster"
              v-if="showNewSubDistributor"
              >Nouveau {{ partenaireTitle }}</BaseButton
            >
>>>>>>> deploy
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
          <div class="font-bold md:text-2xl text-lg" >
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
          <Form class="md:w-3/4 w-full space-y-6" @submit="onSubmit">
            <div class="grid md:grid-cols-2 grid-cols-1 md:gap-6 gap-2">
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
              <BaseInput
                name="téléphone"
                label="Téléphone"
                rules="required|numeric"
                v-model="master.phone"
              ></BaseInput>
              <BaseInput
                name="firstname"
                label="Email"
                rules="required|email"
                v-model="master.email"
              ></BaseInput>
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
            <div class="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-4">
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

            <BaseButton class="md:w-[200px] w-full" :loading="loading">{{
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
import { useUsersStore } from "../../../stores/users";
import {
  OrganisationType,
  UserAccountStatus,
} from "../../../types/enumerations";
import { PrimaryKey } from "../../../types/interfaces";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { Form },
  setup() {
    const etats = computed(() => {
      const items = [{ name: "Dépots", value: OrganisationType.DP }];
      master.type = OrganisationType.DP;

      if (
        organisationType.value == OrganisationType.MD ||
        organisationType.value == OrganisationType.SNB
      ) {
        master.type = OrganisationType.DA;
        items.unshift({
          name: "Distributeurs agréés",
          value: OrganisationType.DA,
        });
      }

      if (organisationType.value == OrganisationType.SNB) {
        master.type = OrganisationType.MD;
        items.unshift({
          name: "Masters distributeurs",
          value: OrganisationType.MD,
        });
      }

      return items;
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
          icon: "eyefine",
          action: details,
        },
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

    function onToggle(value: IOrganisation) {
      selectedMaster.value = value;
      if (value.status === UserAccountStatus.ACTIVE)
        modal.title = `Êtes-vous sûr de vouloir désactiver ${selectedMaster.value.ownerName} ?`;
      if (value.status === UserAccountStatus.INACTIVE)
        modal.title = `Êtes-vous sûr de vouloir activer ${selectedMaster.value.ownerName} ?`;
      modal.show = true;
      modal.subtitle = "";
      modal.mode = "confirm";
      modal.type = "delete";
    }

    async function toogleStatus(value: IOrganisation) {
      try {
        if (selectedMaster.value?.status === UserAccountStatus.ACTIVE) {
          const response = await organizationStore.update(
            selectedMaster.value.id,
            {
              status: UserAccountStatus.INACTIVE,
            }
          );
          modal.title = `${selectedMaster.value?.ownerName}  désactivé avec succès`;
        } else {
          const response = await organizationStore.update(
            selectedMaster.value?.id,
            {
              status: UserAccountStatus.ACTIVE,
            }
          );
          modal.title = `${selectedMaster.value?.ownerName} activé avec succès`;
        }

        reload.value = !reload.value;
        modal.show = true;
        modal.subtitle = "";
        modal.mode = "success";
      } catch (error) {}
    }

    const toggleText = computed(() => {
      if (selectedMaster.value?.status === UserAccountStatus.ACTIVE)
        return "Désactiver";
      else return "Activer";
    });

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
      type: "create" as "create" | "delete" | "update" | "toogleStatus",
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

    // function toogleStatus(element: IOrganisation) {
    //   if (element.status === "active") return (element.status = "inactive");

    //   if (element.status === "inactive") return (element.status = "active");
    // }

    const partenaireTitle = computed(() => {
      if (master.type == OrganisationType.DA) return "distributeur agréé";
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


    const mobileTitles = [
    {
        title: "Nom d'utilisateur",
        name: "ownerName",
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
    ]

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
          modal.title = `Partenaire modifié avec succès.`;
          // toast.success("Partenaire modifié avec succès"); Partenaire modifié avec succès
        } else {
          const response = await organizationStore.create({
            ...master,
            parentOrganisationId: organisationId.value,
          });
          modal.title = `Un nouveau partenaire créé avec succès.`;
          // toast.success("Partenaire crée avec succès"); Partenaire crée avec succès
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

    const emptyMessage = computed(() => {
      if (master.type == OrganisationType.MD)
        return 'Vos masters distributeurs ajoutés seront visibles ici.<br> Cliquez sur le bouton "Nouveau master distributeur" <br> pour ajouter des masters distributeurs';
      else if (master.type == OrganisationType.DA) {
        if (organisationType.value == OrganisationType.MD)
          return 'Vos distributeurs agréés ajoutés seront visibles ici.<br> Cliquez sur le bouton "Nouveau distributeur agréé" <br> pour ajouter des distributeurs agréés';
        else return "Vos distributeurs agréés ajoutés seront visibles ici.";
      } else if (master.type == OrganisationType.DP) {
        if (organisationType.value == OrganisationType.DP)
          return 'Vos dépôts ajoutés seront visibles ici. Cliquez sur le bouton "Nouveau dépôt" pour ajouter des dépôts';
        else return "Vos dépôts ajoutés seront visibles ici.";
      }
    });

    //   async function downloadPartners(organisation: IOrganisation){
    //   await organizationStore.downloadPartners (organisation.id)
    //  }

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
      toogleStatus,
      emptyMessage,
      toggleText,
      UserAccountStatus,
      mobileTitles
      // downloadPartners
    };
  },
});
</script>
<style scoped></style>
