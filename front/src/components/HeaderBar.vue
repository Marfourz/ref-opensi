<template>
  <header
    class="flex items-center md:p-8 p-4 w-full h-14 border border-[#EDEFF3]"
  >
    <nav class="w-full flex justify-between">
      <IconLogo />
      <div class="md:flex space-x-5 items-center hidden">
        <BaseIcon
          name="notification"
          class="cursor-pointer"
          @click="showHistoric"
        ></BaseIcon>
        <div class="bg-borderColor h-1/2 w-[1px]"></div>
        <div class="hidden md:flex items-center space-x-2">
          <IconProfile />
          <span class="bg-gray-400 separator"></span>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-black">{{ username }}</span>
            <span class="text-sm text-gray-400"> {{ roleLabel }}</span>
          </div>
        </div>
      </div>

  
      <div class="flex space-x-9 items-center md:hidden">
        <BaseIcon name="search"></BaseIcon>
        <div class="space-x-8 flex items-center">
          <BaseIcon name="notification"></BaseIcon>
          <div class="" @click="onToggleMenu">
            <BaseIcon name="menu"></BaseIcon>
          </div>
        </div>
      </div>

      <div
        class="block md:hidden fixed bg-black opacity-80 top-14 left-0 right-0 bottom-0 z-20"
        v-if="showMenu"
      ></div>

      <div
        class="block md:hidden fixed bottom-0 left-0 top-14 w-[80%] h-full z-20"
        v-if="showMenu"
      >
        <SideBar class="h-screen w-full" @close="showMenu = false"></SideBar>
      </div>

      <BaseRightModal :show="showModal" v-if="showModal">
        <NotificationList @close="showModal = false"  />
      </BaseRightModal>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import IconLogo from "./icons/IconLogo.vue";
import IconProfile from "./icons/IconProfile.vue";
import SideBar from "@/components/SideBar/index.vue";
import { computed, onMounted, ref } from "vue";
import { useUsersStore } from "../stores/users";
import { UserRole } from "../types/enumerations";
import { IUser } from "@/types/interfaces";
import NotificationList from "@/components/NotificationList.vue";

const showMenu = ref(false);

const userStore = useUsersStore();

const username = computed(() => {
  return userStore.getCurrentUser?.name;
});

const roleLabel = computed(() => {
  return userStore.getRoleLabel(userStore.getCurrentUser?.role as UserRole);
});

const userConnect = computed(() => {
  return userStore.getCurrentUser?.id;
});

const showModal = ref(false);

function showHistoric(value: IUser) {
  showModal.value = true;
  //  userConnect = value.id;
}

function onToggleMenu() {
  console.log("onToggleMenu onToggleMenu");

  showMenu.value = !showMenu.value;
}
</script>

<style scoped>
.separator {
  width: 2px;
}
</style>
