<template>
  <div>
   
    <BaseTableWithFilter  
      :titles="titles"
      :requestId="organisation?.id"
      :fetchData="organisationStore.fetchAllParteners"
      :params="{ type: organisationType }"
    > 
  
    
    <template #status="{ element }">
          <BaseTableStatut
            :title="getStatutLabel(element)"
            :type="getStatutType(element)"
          ></BaseTableStatut>
        </template>
      
        <template #wallet="{ element }">
          <div>{{ element.wallet.turnover }} FCFA</div>
        </template>
  
  </BaseTableWithFilter>
    
  </div>
 
</template>

<script lang="ts">
import { defineComponent,computed,onMounted, PropType } from "vue";
import { useOrganizationStore } from "../stores/organization";
import { useUsersStore } from "../stores/users";
import { OrganisationType, UserAccountStatus } from "../types/enumerations";
import { IOrganisation } from "../types/interfaces";

export default defineComponent({
  props:{
    organisation : {
      type : Object as PropType<IOrganisation>
     }
  },

  setup(props) {

    const organisationStore = useOrganizationStore()
    const usersStore = useUsersStore()

   

    const organisationType = computed(()=>{
      const type = props.organisation?.type
      if(type == OrganisationType.SNB)
        return OrganisationType.MD
      else if (type == OrganisationType.MD)
        return OrganisationType.DA
      else if(type == OrganisationType.DA)
        return OrganisationType.DP
    })

    function getStatutLabel(element: IOrganisation) {
      if (element.status == UserAccountStatus.ACTIVE) return "Actif";
      else if (element.status == UserAccountStatus.INACTIVE) return "Inactif";
      else if (element.status == UserAccountStatus.SUSPENDED) return "Suspendu";
    }

    function getStatutType(element: IOrganisation) {
      if (element.status == UserAccountStatus.ACTIVE) return "success";
      else if (element.status == UserAccountStatus.INACTIVE) return "danger";
      else if (element.status == UserAccountStatus.SUSPENDED) return "warning";
    }

    function getTotalOrder(element: IOrganisation) {
      if (element.orders) return element.orders.length;
      return 0;
    }

    

   


    const titles = [
      {
        title: "Nom",
        name: "socialReason",
      },
      {
        title: "Téléphone",
        name: "phone",
      },
      {
        title: "Email",
        name: "email",
      },

      {
        title: "Commandes",
        name: "commandes",
        transform: getTotalOrder,
      },
      {
        title: "Chiffre d’affaire",
        name: "wallet",
      },
      {
        title: "Statut",
        name: "status",
      },
    ];
    return {
      titles,
      organisationType,
      organisationStore,
      getStatutLabel,
      getStatutType
    };
  },
});
</script>

<style scoped></style>
