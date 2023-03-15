<template>
  <div class="bg-[#259475] hidden h-full lg:block " :class="{ 'w-[23%]': !showOnlyIcon, 'pr-8': showOnlyIcon }">
    <div class="text-white flex items-center space-x-10 pl-8 py-6 cursor-pointer" @click="showOnlyIcon = !showOnlyIcon">
      <BaseIcon name="arrowLeft" class="text-white" v-if="!showOnlyIcon"></BaseIcon>
      <BaseIcon name="arrowRigth" class="text-white w-3.5 h-3.5" v-else></BaseIcon>
      <div class="" v-if="!showOnlyIcon">Réduire</div>
    </div>
    <div class="space-y-6">

      <div v-for="menu in menus" :key="menu.title">
        <SideItem v-if="showMenu(menu)" :icon="menu.icon" :label="menu.title" :isActive="activeRouteName == menu.route"
          :showOnlyIcon="showOnlyIcon" @click="changeMenu(menu)" />
      </div>

      <div class="h-[1px] bg-[black] opacity-20 w-full"></div>


      <SideItem :icon="menu.icon" :label="menu.title" :key="menu.title" :isActive="activeRouteName == menu.route"
        :showOnlyIcon="showOnlyIcon" v-for="menu in bottomMenus" @click="changeMenu(menu)" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import SideItem from "./SideItem.vue";

import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "../../stores/users";
import { OrganisationType, UserRole } from "../../types/enumerations";
import { useAuthStore } from "../../stores/users/auth-store";

interface IMenu {
  title: string,
  icon: string,
  route: string,
  path: string,
  roles?: string[],
  organizations?: OrganisationType[]
}

export default defineComponent({
  components: {
    SideItem,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeMenu = ref("Accueil");
    const showOnlyIcon = ref(false);

    const bottomMenus = [
      {
        title: "Utilisateurs",
        icon: "user",
        route: "users",
        path: "utitlisateurs",

      },
      {
        title: "Paramètres",
        icon: "setting",
        route: "setting",
        path: "parametre",

      },
      {
        title: "Déconexion",
        icon: "logout",
        route: "logout",
        path: "deconnexion",


      },
    ];

    const menus: Array<IMenu> = [
      {
        title: "Tableau de bord",
        icon: "dashboard",
        route: "dashboard",
        path: "dashboard",
        roles: [],
      },
      {
        title: "Mes appros",
        icon: "appros",
        path: "appros",
        route: "appros",
        roles: [UserRole.ADMIN, UserRole.SUPER_USER],
        organizations: [OrganisationType.MD]
      },

      {
        title: "Commandes reçues",
        icon: "panier",
        path: "commandes",
        route: "orderReceived",
        roles: [UserRole.ADMIN, UserRole.SUPER_USER],
        organizations: [OrganisationType.MD, OrganisationType.SNB]
      },

      {
        title: "Partenaires",
        icon: "groupUsers",
        route: "subDistributors",
        path: "sous-distributeurs",
        roles: [UserRole.ADMIN, UserRole.SUPER_USER],
        organizations: [OrganisationType.SNB]
      },
      {
        title: "Livreurs",
        icon: "deliveryPerson",
        route: "deliveryPerson",
        path: "livreurs",

        roles: [UserRole.ADMIN, UserRole.SUPER_USER],
        organizations: [OrganisationType.SNB]
      },

      {
        title: "Produits",
        icon: "product",
        route: "products",
        path: "produits",
        roles: [UserRole.ADMIN, UserRole.SUPER_USER],
        organizations: [OrganisationType.SNB]
      },
      {
        title: "Stock",
        icon: "stock",
        route: "stock",
        path: "stock",
        roles: [UserRole.ADMIN, UserRole.SUPER_USER],
        organizations: [OrganisationType.SNB, OrganisationType.MD]
      }
    ];

    const authStore = useAuthStore();

    function changeMenu(menu: any) {
      if (menu.route == 'logout') {
        authStore.logout()
        router.push({ name: 'login' })
      }

      activeMenu.value = menu.title;
      router.push({ name: menu.route });
    }

    const organizationType = computed(() => {
      return userStore.getCurrentUser?.organisation?.type
    })

    const role = computed(() => {
      return userStore.getCurrentUser?.role
    })

    function showMenu(menu: any): boolean {

      if (!menu.organizations || menu.organizations.length == 0)
        return true
      if (menu.organizations.find((value: OrganisationType) => value == organizationType.value)) {
        if (!menu.roles || menu.roles.length == 0)
          return true
        else if (menu.roles.find((value: UserRole) => value == role.value))
          return true
      }

      return false

      return false;
    }
    const activeRouteName = computed(() => {

      const routesList = route.path.split("/");

      if (route.name == "dashboard")
        return 'dashboard'
      const actualRoute = routesList[3];

      const allMenus = menus.concat(bottomMenus)

      const menu: any = allMenus.find((value: any) => {
        if (value?.path) {
          const valuePath: string | null = value?.path.split("/")[0];
          return valuePath == actualRoute;
        } else return false;
      });

      if (menu) return menu.route;
      return null;
    });

    function goToHome() {
      router.push({
        name: "publications",
      });
    }

    const userStore = useUsersStore()

    function onMenuClick() {

    }
    return {
      menus,
      activeMenu,
      changeMenu,
      goToHome,
      activeRouteName,
      showOnlyIcon,
      bottomMenus,
      onMenuClick,
      showMenu,
    };
  },
});
</script>

<style scoped></style>
