import DefaultLayout from "@/layouts/default.vue";
import DeliveryPerson from "@/views/snb/deliveryPerson/index.vue";
import LivreursDetails from "@/views/snb/deliveryPerson/details.vue";
import OrderReceived from "@/views/snb/orderReceived/index.vue";
import SubDistributors from "@/views/snb/subDistributors/index.vue";
import DistributorsDetails from "@/views/snb/subDistributors/details.vue";
import Product from "@/views/snb/products/index.vue";
import Stock from "@/views/snb/stock/index.vue";
import Parameter from "@/views/parameter/index.vue";
import Appros from "@/views/snb/appros/index.vue";
import ApprosCreate from "@/views/snb/appros/create.vue";
import Users from "@/views/users/index.vue";
import Category from "@/views/snb/categories/index.vue";
import UpdateStock from "@/views/snb/stock/update.vue";

export default [
  {
    path: "/dashboard/snb",
    component: DefaultLayout,
    meta: {
      auth: true,
    },
    children: [
      {
        path: "commandes",
        name: "orderReceived",
        component: OrderReceived,
        meta: {
          withoutPadding: true,
        },
        children: [
          {
            path: "commandes",
            name: "orderReceived",
            component: OrderReceived,
            meta: {
              withoutPadding: true,
            },
          },
          {
            path: "appros",
            name: "appros",
            component: Appros,
            meta: {
              withoutPadding: true,
            },
          },
          {
            path: "appros/create",
            name: "approsCreate",
            component: ApprosCreate,
            meta: {
              withoutPadding: true,
            },
          },
        ],
      },
      {
        path: "appros",
        name: "appros",
        component: Appros,
        meta: {
          withoutPadding: true,
        },
      },
      {
        path: "appros/create",
        name: "approsCreate",
        component: ApprosCreate,
        meta: {
          withoutPadding: true,
        },
      },
      {
        path: "sous-distributeurs",
        name: "subDistributors",
        component: SubDistributors,
      },
      {
        path: "sous-distributeurs/details/:id",
        name: "sousDistributeursDetails",
        component: DistributorsDetails,
      },

      {
        path: "produits/categories",
        name: "categories",
        component: Category,
      },
      {
        path: "produits",
        name: "products",
        component: Product,
      },
      {
        path: "livreurs",
        name: "deliveryPerson",
        component: DeliveryPerson,
      },
      {
        path: "livreurs/details/:id",
        name: "livreursDetails",
        component: LivreursDetails,
      },
      {
        path: "stock",
        name: "stock",
        component: Stock,
      },
      {
        path: "utitlisateurs",
        name: "users",
        component: Users,
      },
      {
        path: "stock/update",
        name: "updateStock",
        component: UpdateStock,
      },
    ],
  },
];
