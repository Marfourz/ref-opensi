<template>
  <div class="flex gap-4">
    <div class="flex justify-center flex-col">
      <div class=" p-1.5 rounded-full"
          :style="`background-color: ${paramToUse.secondColor}`"
      >
        <div
          class="w-4 h-4 rounded-full"
          :style="`background-color: ${paramToUse.primaryColor}`"
        ></div>
      </div>
      <div class="flex-1 relative">
        <div
          class="absolute h-full border-dashed border-r-2 translate-x-1/2 right-1/2"
          :style="`border-color: ${paramToUse.primaryColor}`"
        ></div>
      </div>
    </div>
    <div class="mb-4 flex-1">
      <span class="text-grey-50 text-xs"> {{ date }}</span>
      <div
        class="rounded-lg border-2  flex gap-4 p-4"
        :style="`border-color: ${paramToUse.primaryColor}; background-color: ${paramToUse.secondColor}` "
      >
        <component :is="paramToUse.icon" class="w-5 h-5" />
        <div class="flex flex-1 justify-between items-center">
          <div class="">
            <p class="font-semibold">{{ paramToUse.title }}</p>
            <div class="inline-block border-r text-grey-50 pr-2 mr-2">
              Nombre de {{ packaging }}:
              <span class="text-black"> {{ casier }}</span>
            </div>
            <router-link to="" class="text-[#2062F6] font-semibold"
              >Voir détails</router-link
            >
          </div>
          <span class="text-xl font-bold "
          :style="`color: ${paramToUse.primaryColor}`"> {{ amount }} FCFA</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StockState } from "@/types/enumerations";
import { defineComponent, PropType } from "vue";
import IconDeposit from "./icons/IconDeposit.vue";
import IconDepositb from "./icons/IconDepositb.vue";

type Params = {
  title: string;
  icon: typeof IconDeposit | typeof IconDepositb;
  primaryColor: String;
  secondColor: String;
};

const MAPPING_OBJ: Record<StockState, Params> = {
  "": {
    title: "",
    icon: IconDeposit,
    primaryColor: "#287D3C",
    secondColor: "287D3C",
  },

  sale: {
    title: "Vente",
    icon: IconDeposit,
    primaryColor: "#287D3C",
    secondColor: "#EDF9F0",

  },
  supply: {
    title: "Approvisionnement",
    icon: IconDepositb,
    primaryColor: "#0050CF",
    secondColor: "#F0F5FF",

  },
};

export default defineComponent({
  props: {
    type: {
      required: true,
      type: String as PropType<StockState>,
    },

    date: {
      type: String,
    },
    amount: {
      type: Number,
    },
    casier: {
      type: Number,
    },
    packaging: {
      type: String,
    },
  },

  setup(props) {
    const paramToUse = MAPPING_OBJ[props.type];


    return { paramToUse };
  },
});
</script>

<style lang="scss" scoped></style>
