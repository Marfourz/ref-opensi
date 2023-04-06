<template>
  <div class="py-8 px-6">
    <div class="flex justify-between items-center mb-8">
      <div class="text-2xl font-semibold">Notifiations</div>
      <BaseIcon
        name="close"
        class="w-5 h-5 cursor-pointer"
        @click="$emit('close')"
      ></BaseIcon>
    </div>
   <Notification />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from "vue";

import Notification from "@/components/Notification.vue";
export default defineComponent({
  components: {Notification},

//   props: {
//     orderId: { type: String, required: true },
//     orderStatus: {
//       type: String as () =>
//         | "success"
//         | "danger"
//         | "warning"
//         | "colorize"
//         | "blue",
//     },
//     orderStatusLabel: { type: String },
//     order: {
//       required: true,
//       type: Object as PropType<IOrder>,
//     },
//   },

  setup(props) {

    onMounted(async () => {
    });

    return {   };
  },
});
</script>
