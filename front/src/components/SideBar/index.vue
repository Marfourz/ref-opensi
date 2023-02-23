<template>
   <div class="bg-[#259475] hidden h-full lg:block " :class="{'w-1/4' : !showOnlyIcon , 'pr-8' : showOnlyIcon}">
      <div class="text-white flex items-center space-x-10 pl-8 py-6 cursor-pointer" @click="showOnlyIcon = !showOnlyIcon">
        <BaseIcon name="arrowLeft" class="text-white" v-if="!showOnlyIcon"></BaseIcon>
        <BaseIcon name="arrowRigth" class="text-white w-3.5 h-3.5" v-else></BaseIcon>
        <div class="" v-if="!showOnlyIcon">Réduire</div>
      </div>
      <div class="space-y-6">
        <SideItem
          :icon="menu.icon"
          :label="menu.title"
          :key="menu.title"
          :isActive="activeRouteName == menu.route"
          :showOnlyIcon="showOnlyIcon"
          v-for="menu in menus"
          @click="changeMenu(menu)"
        />

        <div class="h-[1px] bg-[black] opacity-20 w-full"></div>

        
        <SideItem
          :icon="menu.icon"
          :label="menu.title"
          :key="menu.title"
          :isActive="activeRouteName == menu.route"
          :showOnlyIcon="showOnlyIcon"
          v-for="menu in bottomMenus"
          @click="changeMenu(menu)"
        />
      </div>
     
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import SideItem from "./SideItem.vue";

import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  components: {
    SideItem,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeMenu = ref("Accueil");
    const showOnlyIcon = ref(false)

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
    ]

    const menus = [
      {
        title: "Tableau de bord",
        icon: "dashboard",
        route: "dashboard",
        path: "dashboard",
      },
      {
        title: "Mes appros",
        icon: "appros",
        path: "appros",
        route: "appros",
      },

      {
        title: "Commandes reçues",
        icon: "panier",
        path: "commandes",
        route: "orderReceived",
      },

      {
        title: "Partenaires",
        icon: "groupUsers",
        route: "subDistributors",
        path: "sous-distrivuteurs",
      },
      {
        title: "Livreurs",
        icon: "deliveryPerson",
        route: "deliveryPerson",
        path: "livreurs",
      },

      {
        title: "Produits",
        icon: "product",
        route: "products",
        path: "produits",
      },
      {
        title: "Stock",
        icon: "stock",
        route: "stock",
        path: "stock",
      }
    ];
    function changeMenu(menu: any) {
      console.log("actual menu", menu)
      activeMenu.value = menu.title;
      router.push({ name: menu.route });
    }
    const activeRouteName = computed(() => {
      const routesList = route.path.split("/");
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
    return {
      menus,
      activeMenu,
      changeMenu,
      goToHome,
      activeRouteName,
      showOnlyIcon,
      bottomMenus
    };
  },
});
</script>

<style scoped></style>
