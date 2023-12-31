<template>
  <div class="space-y-6 mt-4">
    
    <div v-if="!justAssign">
      <div class="font-[#0F0F14] text-[14px] mb-1">Date de livraison</div>
      <BaseInput
        type="date"
        name="Date de livraison"
        v-model="assignData.deliveryDate"
      ></BaseInput>
      <div class="text-xs text-[#7C89A3] mt-1">
        Vous pouvez le faire ultérieuremement
      </div>
    </div>

    <div>
      <div class="font-[#0F0F14] text-[14px] mb-1">Livreur</div>
      <base-auto-complete
        ref="autocomplete"
        placeholder="Rechercher"
        class="w-full"
        :fetchAutoCompleteData="onSearchDeliveryPerson"
        :getOptionLabel="deliveryPersonFullName"
        @change="onSelecteDeliveryPersonChange"
      >
      </base-auto-complete>
      <div class="text-xs text-[#7C89A3] mt-1" v-if="!justAssign">
        Vous pouvez le faire ultérieuremement
      </div>
    </div>

    <div class="rounded bg-[#F0F5FF] p-4 flex items-center space-x-5" v-if="!justAssign">
      <BaseIcon name="info" class="w-4.5 h-4.5"></BaseIcon>
      <div class="font-semibold text-[#002D6E]" style="line-height: 20px">
        Nous enverrons la facture proforma de la commande au client
      </div>
    </div>

    <div class="flex items-center space-x-4 w-1/2">
      <BaseButton
        class="w-full"
        :loading="loading"
        @click="onSubmit"
        size="medium"
        >Valider</BaseButton
      >
      <BaseButton outline="true" size="medium" class="w-full" @click="$emit('reset')"
        >Annuler</BaseButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Form } from "vee-validate";
import { defineComponent, reactive, computed, ref, PropType } from "vue";
import { useToast } from "vue-toastification";
import BaseAutoComplete from "../../../../components/base/BaseAutoComplete.vue";
import { useOrdersStore } from "../../../../stores/orders";
import { useOrganizationStore } from "../../../../stores/organization";
import { useUsersStore } from "../../../../stores/users";
import { OrderStatus } from "../../../../types/enumerations";
import { IOrder, IUser } from "../../../../types/interfaces";

export default defineComponent({
  components: { Form, BaseAutoComplete },
  props: {
    orderId: {
      type: String,
      required: true,
    },

    justAssign : {
      type: Boolean,
      default : false
    }
   
  },
  setup(props, context) {
    const assignData = reactive({
      deliveryDate: null,
      deliveryMan: "",
      status: null,
    });

    const userStore = useUsersStore();

    const organisationStore = useOrganizationStore();

    const organisationId = computed(() => {
      return userStore.getCurrentUser?.organisationId;
    });

    async function onSearchDeliveryPerson(search: string) {
      const response = await organisationStore.fetchAllDeliveryMen(
        { limit: -1, q: search },
        organisationId.value
      ); //)
      return response.data;
    }

    function deliveryPersonFullName(person: IUser) {
      console.log("person", person);

      return person.name + " " + person.firstName;
    }

    function onSelecteDeliveryPersonChange(person: IUser) {
      console.log("onSelecteDeliveryPersonChange", person);
      assignData.deliveryMan = person.id as string;
    }

    const ordersStore = useOrdersStore();

    const toast = useToast()

    const loading = ref(false);
    async function onSubmit() {
      loading.value = true;
      try {
        const body = props.justAssign ? {
          ...assignData,
          status: OrderStatus.ACCEPTED,
        } : { deliveryMan : assignData.deliveryMan}
        const response = await ordersStore.update(props.orderId, {
          ...assignData,
          status: OrderStatus.ACCEPTED,
        });
        context.emit("submitSuccess");
        loading.value = false;
      } catch (error:any) {
        loading.value = false;
        context.emit("close");
        toast.error(error.response.data.message)
        
      }
    }

    return {
      assignData,
      onSearchDeliveryPerson,
      deliveryPersonFullName,
      onSelecteDeliveryPersonChange,
      onSubmit,
      loading
    };
  },
});
</script>

<style scoped></style>
