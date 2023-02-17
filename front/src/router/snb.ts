import DefaultLayout from "@/layouts/default.vue"
import DeliveryPerson from "@/views/snb/deliveryPerson/index.vue"
import OrderReceived from "@/views/snb/orderReceived/index.vue"
import SubDistributors from "@/views/snb/SubDistributors/index.vue"
import Stock from "@/views/snb/stock/index.vue"
import Parameter from "@/views/parameter/index.vue"
import Appros from "@/views/snb/appros/index.vue"
import ApprosCreate from "@/views/snb/appros/create.vue"
import Users from "@/views/users/index.vue"


export default [
    { 
        path : '/dashboard/snb',
        component:DefaultLayout,
        children:[
          {
            path:'commandes',
            name : 'orderReceived',
            component : OrderReceived
          },
          {
            path:'appros',
            name : 'appros',
            component : Appros,
            meta:{
              withoutPadding : true
            }
          },
          {
            path:'appros/create',
            name : 'approsCreate',
            component : ApprosCreate,
            meta:{
              withoutPadding : true
            }
          },
          {
            path:'sous-distrivuteurs',
            name : 'subDistributors',
            component : SubDistributors
          },
          {
            path:'livreurs',
            name : 'deliveryPerson',
            component : DeliveryPerson
          },
          {
            path:'stock',
            name : 'stock',
            component : Stock
          },
          {
            path:'utitlisateurs',
            name : 'users',
            component : Users
          },

        ]
  
      },

     
]