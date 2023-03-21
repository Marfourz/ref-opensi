<template>
  <div class="py-8 px-6">
    <div class="flex justify-between items-center mb-8">
      <div class="text-2xl font-semibold">Historique</div>
      <BaseIcon
        name="close"
        class="w-5 h-5 cursor-pointer"
        @click="close"
      ></BaseIcon>
    </div>
    <div class="flex mt-8">
      <div class="font-semibold text-base">Commande</div>
      <!-- <BaseTableStatut :title="order.status" class="ml-2"></BaseTableStatut>  -->
    </div>
    <!-- <div class="mt-4"><history-tracking :type="validated" :date="order.updatedAt"></history-tracking></div>  -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import HistoryTracking from "@/components/HistoryTracking.vue";

const showModal = ref(false);
 function close(){
  showModal.value =true;
 };
export default defineComponent({
  components: { HistoryTracking },
  props: {
    // orders: {
    //   type: String,
    // },
  },

  setup(props) {
    onMounted(async () => {});

    return {
      showModal,
      close,
    };
  },
});
</script>
