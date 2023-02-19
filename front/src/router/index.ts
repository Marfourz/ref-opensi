import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from "@/layouts/default.vue"
import TableauBord from "@/views/index.vue"
import AuthRoutes from "@/router/auth"
import SnbRoutes from "@/router/snb"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path : '/',
      component:DefaultLayout,
      children:[
        {
          path:'',
          name : 'tableauBord',
          component : TableauBord
        }
      ]
    },
    
    ...AuthRoutes,
    ...SnbRoutes
  ]
})



import { useUsersStore } from "../stores/users";

router.beforeEach(async (to, from, next) => {
  let data = JSON.parse(localStorage.getItem('current_user') as string)

  

  if (to.meta.auth) {
    if (!data) next("/auth/login");
    next();
    // else {
    //   console.log('data', data.id)
    //   try {
    //     await useUsersStore().me();
    //     next();
    //   } catch (error: any) {
    //     next("/auth/login");
    //   }
    // }
  }
  else
    next();

 
});

export default router
