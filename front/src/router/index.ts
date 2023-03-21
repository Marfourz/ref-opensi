import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/default.vue";
import TableauBord from "@/views/index.vue";
import AuthRoutes from "@/router/auth";
import SnbRoutes from "@/router/snb";
import Login from "@/views/auth/login.vue";
import PdfViewer from '@/views/pdf-viewer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      name: "login1",
      component: Login,
      meta: {
        title: "Connexion",
        subtitle:
          "Veuillez  vous connecter en renseignant votre mail et votre mot de passe",
      },
    },
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: TableauBord,
        },
      ],
    },
    {
      path: "/pdf/viewer/:link",
      name: "pdfViewer",
      component: PdfViewer,
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
