<template>
  <div class="">
    <PageInTwoPart>
      <template #firstPart>
        <div class="space-y-8">
          <div class="flex space-x-6 items-center">
            <BaseTitle title="Mes appros"></BaseTitle>
            <BaseButton icon="plus" size="small" @click="goToCreateAppros">Nouvel appro</BaseButton>
          </div>
          <BaseTableWithFilter 
            :titles="titles" 
            :requestId="organisationId"
            :fetchData="orderStore.fetchAllByOrganization" >
            <template #status="{element}">
     
            <BaseTableStatut :title="getStatutLabel(element)" :type="getStatutType(element)"></BaseTableStatut>
              
            </template>
          </BaseTableWithFilter>
        </div>
      </template>
      <template #secondPart>
        <Order :order="order" v-if="order">
          <template #title>
            <div class="flex space-x-2 items-center">
                <div class="font-bold text-lg">Appro #56767</div>
                <BaseTableStatut title="Livré" type="success"></BaseTableStatut>
            </div>
          </template>
        </Order>
      </template>
    </PageInTwoPart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import PageInTwoPart from "../../../components/PageInTwoPart.vue";
import {useOrdersStore} from "@/stores/orders"
import Order from "@/components/Order.vue"
import { OrderStatus, OrganisationType } from "../../../types/enumerations";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../../stores/users";


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
        name: "totalAmount",
      },
      {
        title: "Statut",
        name: "status",
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

    const orderStore = useOrdersStore()
    const userStore = useUsersStore()

    const organisationId = computed(()=>{
      return userStore.getCurrentUser?.organisationId
    })

    const router = useRouter()
    function goToCreateAppros(){
      router.push({
        name : 'approsCreate'
      })
    }

    function getStatutLabel(element : any){

        if(element.status == OrderStatus.ACCEPTED )
            return "Accepté"
        else if(element.status == OrderStatus.DELIVERED)
            return "Inactive"
        else if(element.status == OrderStatus.NEW)
            return "Nouveau"
        }

        function getStatutType(element : any){

          if(element.status == OrderStatus.ACCEPTED )
            return "Accepté"
        else if(element.status == OrderStatus.DELIVERED)
            return "Inactive"
        else if(element.status == OrderStatus.NEW)
            return "Nouveau"

       
        }


   


    return {
      titles,
      goToCreateAppros,
      order,
      organisationId,
      orderStore,
      getStatutLabel,
      getStatutType
      
    };
  },
});
</script>

<style scoped></style>
