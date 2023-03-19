<template>
  <div class="flex gap-4">
    <div class="flex justify-center flex-col">
      <div class="bg-fadePrimary p-1.5 rounded-full" >
        <div class="w-4 h-4 rounded-full" :class="{'bg-primary ': type == 'Livrée','bg-[#6929C4]': type == 'acceptée', 'bg-[#0050CF]': type == 'créée'}"></div>
      </div>
      <div class="flex-1 relative">
        <div
          class="absolute h-full border-dashed border-r-2  translate-x-1/2 right-1/2" :class="{'border-primary ': type == 'Livrée','border-[#6929C4]': type == 'acceptée', 'border-[#0050CF]': type == 'créée'}"
        ></div>
      </div>
    </div>
    <div class="mb-4 flex-1">
      <div
        class="rounded-lg border  gap-4 p-4 bg-fadePrimary flex" :class="{'border-primary ': type == 'Livrée','border-[#6929C4]': type == 'acceptée', 'border-[#0050CF]': type == 'créée'}"
      >
        <BaseIcon name="deposit" />
        <div class="flex-col">
          <div class="font-semibold text-base">Commande Livrée</div>

          <div class="flex mt-2 gap-4">
            <BaseIcon name="horloge" />
            <span class="text-grey-50 font-semibold text-sm">22 Avril, 10:12</span>
          </div>
          <div class="flex flex-1 justify-between items-center mt-2">
            <div class="">
              <div class="inline-block border-r text-grey-50 pr-2 mr-2">
                Livrée par
              </div>
              <router-link to="" class="text-[#2062F6] font-semibold"
                >Nadège Samuel</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String as () =>
        | "Livrée"
        | "acceptée"
        | "créée",

    },
    label: {
      type: String,
    },
    title: {
      type: String
    }
  },

  setup() {
    return {

    }
  }

});
</script>

<style lang="scss" scoped></style>
