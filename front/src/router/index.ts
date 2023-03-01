import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/default.vue";
import TableauBord from "@/views/index.vue";
import AuthRoutes from "@/router/auth";
import SnbRoutes from "@/router/snb";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: TableauBord,
        },
      ],
    },

    ...AuthRoutes,
    ...SnbRoutes,
  ],
});

import { useUsersStore } from "../stores/users";

router.beforeEach(async (to, from, next) => {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("current_user") as string);
  } catch (error) {
    console.log("data", error);
    data = null;
  }

  if (to.meta.auth) {
    if (!data) next("/auth/login");
    else {
      console.log("data", data.id);
      try {
        useUsersStore().me();
        next();
      } catch (error: any) {
        next("/auth/login");
      }
      next();
    }
  } else next();
});

export default router;
