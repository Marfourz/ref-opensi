<template>
    <div class="">
      <PageInTwoPart>
        <template #firstPart>
          <div class="space-y-8">
            <div class="flex space-x-6 items-center">
              <BaseTitle title="Mes commandes"></BaseTitle>
            </div>
            <BaseTableWithFilter :titles="titles"></BaseTableWithFilter>
          </div>
        </template>
        <template #secondPart>
          <Order :order="order">
            <template #title>
              <div class="flex space-x-2 items-center">
                  <div class="font-bold text-lg">Commande #56767</div>
                  <BaseTableStatut title="Livré" type="success"></BaseTableStatut>
              </div>
            </template>
          </Order>
        </template>
      </PageInTwoPart>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import PageInTwoPart from "../../../components/PageInTwoPart.vue";
  import Order from "@/components/Order.vue"
  import { OrderStatus, OrganisationType } from "../../../types/enumerations";
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    components: { PageInTwoPart,Order },
    setup() {
      const titles = [
        {
          title: "Appro",
          name: "appro",
        },
        {
          title: "Date",
          name: "createdAt",
        },
        {
          title: "Total",
          name: "total",
        },
        {
          title: "Statut",
          name: "statut",
        },
        {
          title: "Action",
          name: "action",
        },
      ];
      
      const order = ref()

      // const order = {
      //     organisation : OrganisationType.SNB,
      //     items : [
      //         {
      //             id : 1,
      //             createdAt : new Date(),
      //             updatedAt : new Date(),
      //             product : {
      //                 name : "Chap 50 CL",
      //                 unitPrice : 1000,
      //                 rackPrice : 1000,
      //                 packPrice : 20000,
      //                 volume : 2000,
      //             },
      //             quantity : 10,
      //             price : 2000,
      //         },
      //         {
      //             product : {
      //                 name : "Chap Cola 50 CL",
      //                 unitPrice : 500,
      //                 rackPrice : 1000,
      //                 packPrice : 20000,
      //                 volume : 200,
      //             },
      //             quantity : 220,
      //             price : 200,
      //         }
      //     ],
      //     totalAmount : 1000000,
      //     transaction : {
              
      //     },
      //     status :OrderStatus.DELIVERY,
      //     deliveryDate : Date
      // }
  
      const router = useRouter()
      function goToCreateAppros(){
        router.push({
          name : 'approsCreate'
        })
      }
  
  
      return {
        titles,
        goToCreateAppros,
        order
      };
    },
  });
  </script>
  
  <style scoped></style>
  