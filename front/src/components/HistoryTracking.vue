<template>
  <div class="flex gap-4">
    <div class="flex justify-center flex-col">
      <div class="p-1.5 rounded-full bg-fadePrimary"
          :style="`background-color: ${paramToUse.secondColor}`"
      >
        <div
          class="w-4 h-4 rounded-full"
          :style="`background-color: ${paramToUse.primaryColor}`"
        ></div>
      </div>
      <div class="flex-1 relative mt-2">
        <div
          class="absolute h-full border-r-2 translate-x-1/2 right-1/2"
          :style="`border-color: ${paramToUse?.primaryColor}`"
        ></div>
      </div>
    </div>
    <div class="mb-4 flex-1">
      <div
        class="rounded-lg border gap-4 p-4 flex"
        :style="`border-color: ${paramToUse.primaryColor}`"
      >
        <component :is="paramToUse.icon" class="w-5 h-5" />
        <div class="flex-col">
          <div class="font-semibold text-base">{{ paramToUse.title }}</div>

          <div class="flex mt-2 gap-4">
            <BaseIcon name="horloge" />
            <span class="text-grey-50 font-semibold text-sm">{{ date }}</span>
          </div>
          <div class="flex flex-1 justify-between items-center mt-2">
            <div class="">
              <div class="inline-block border-r text-grey-50 pr-2 mr-2">
                {{ paramToUse.message }}
              </div>
              <router-link to="" class="text-[#2062F6] font-semibold">{{
                name
              }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import IconLivrer from "./icons/IconLivrer.vue";
import IconAccepter from "./icons/IconAccepter.vue";
import IconCreer from "./icons/IconCreer.vue";
import { HistoricalOrderStatus } from "@/types/enumerations";

type Params = {
  title: string;
  icon: typeof IconCreer | typeof IconAccepter | typeof IconLivrer;
  message: String;
  primaryColor: String;
  secondColor: String;

};

const MAPPING_OBJ: Record<HistoricalOrderStatus, Params> = {
  created: {
    title: "Commande créé",
    icon: IconCreer,
    message: "Créer par ",
    primaryColor: "#0050CF",
   secondColor: "#EBF3FA",

  },
  accepted: {
    title: "Commande acceptée",
    icon: IconAccepter,
    message: "Acceptée par ",
    primaryColor: "#6929C4",
    secondColor: "#F3F0FA",

  },
  delivered: {
    title: "Commande Livrée",
    icon: IconLivrer,
    message: "Livrée par ",
    primaryColor: "#28C75D",
    secondColor: ''
  },
};

export default defineComponent({
  props: {
    type: {
      required: true,
      type: String as PropType<HistoricalOrderStatus>,
    },

    name: {
      type: String,
    },
    date: {
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
