<template>
  <div class="">
    <div class="flex justify-between">
      <div>
        <router-link
          :to="{ name: 'livreursDetails' }"
          path="livreurs/details/:id"
        >
          <BaseGoBack> </BaseGoBack>
        </router-link>
      </div>
      <div class="hidden md:block">
        <BaseButton
          size="small"
          @click="toggleState"
          :bg-color="stateTitle === 'Désactiver' ? 'danger' : 'primary'"
          
        >
          {{ stateTitle }}
        </BaseButton>
      </div>
    </div>
    <div class="mt-5 space-x-4 flex">
      <span class="font-semibold text-xl">{{ user?.identifier }}</span>
      <span class="font-semibold text-xl">{{ user?.name }}</span>
      <BaseTableStatut
        :type="stateTitle === 'Désactiver' ? 'success' : 'danger'"
        :title="statusTitle"
      ></BaseTableStatut>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">

      <div class="flex flex-col">
        <span class="font-semibold text-base">Nom</span>
        <span class="font-medium text-sm">{{ user?.name }}</span>
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-base">Prénom(s)</span>
        <span class="font-medium text-sm"> {{ user?.firstName }} </span>
      </div>

      <div class="flex flex-col">
        <span class="font-semibold text-base">Sexe</span>
        <span class="font-medium text-sm" v-if="user && user.sex"> {{sexMappingObject[user?.sex ]  }} </span>
        <!-- <span class="font-medium text-sm" v-if="user && user.sex"> {{Sex[user.sex.toLocaleUpperCase()] }} </span> -->
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-base">Email</span>
        <span class="font-medium text-sm">{{ user?.email }}</span>
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-base">Téléphone</span>
        <span class="font-medium text-sm"> {{ user?.phone }} </span>
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-base">Date de naissance</span>
        <span class="font-medium text-sm">
          {{
            !user?.birthday
              ? "Non défini"
              : helpers.formatDateReduce(String(user?.birthday))
          }}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-base">Engin </span>

        <span class="font-medium text-sm"> {{ user?.engine?.name }} </span>
      </div>
      <div class="flex flex-col">
        <span class="font-semibold text-base">Adresse</span>
        <span class="font-medium text-sm"> {{ user?.address }} </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import { useUsersStore } from "@/stores/users";
import { UserAccountStatus } from "@/types/enumerations";
import { IUser } from "@/types/interfaces";
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import helpers from "@/helpers/index";
import { Sex } from "@/types/enumerations";
export default defineComponent({
  components: { BaseTableStatut },
  setup() {
    const userStore = useUsersStore();
    const user = ref<IUser | null>();
    const route = useRoute();

    const id = computed(() => {
      return route.params.id;
    });

    const stateTitle = computed(() => {
      if (user.value && user.value.status == UserAccountStatus.INACTIVE)
        return "Activer";
      else return "Désactiver";
    });

const statusTitle = computed(() => {
    if (user.value && user.value.status == UserAccountStatus.INACTIVE)
        return "Inactif";
      else return "Actif";
})

    const sexMappingObject : Record <Sex, string> ={
      male: "Homme",
      female: "Femme",
      others: "Autre",
    };
    async function toggleState() {
      if (user.value) {
        if (user.value.status == UserAccountStatus.ACTIVE) {
          user.value.status = UserAccountStatus.INACTIVE;
        } else {
          user.value.status = UserAccountStatus.ACTIVE;
        }
      }

      await userStore.update(user.value?.id, user.value);
    }

    onMounted(async () => {
      try {
        const response = await userStore.findOne(id.value as string);
        user.value = response;
        console.log(user.value);
      } catch (error) {}
    });
    return {
      Sex,
      user,
      stateTitle,
      statusTitle,
      toggleState,
      helpers,
      sexMappingObject,
    };
  },
});
</script>
<style scoped></style>
