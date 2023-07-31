<template>
  <div class="h-screen w-screen bg-[url('../assets/images/authBg.png')]">
    <div
      class="fixed top-0 bottom-0 left-0 right-0 bg-[#095741] opacity-95"
    ></div>
    <div
      class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center"
    >
      <div
        class="bg-white w-[80%] md:w-1/2 lg:w-[37%] py-10 px-14 rounded-2xl space-y-4 text-center flex flex-col items-center"
      >
        <img
          src="@/assets/images/logo.png"
          alt=""
          style="width: 100px; height: 100px"
        />

        <div class="text-2xl font-bold" v-html="title"></div>
        <div class="text-[16px]" v-html="subtitle"></div>
        <div class="px-15 pt-10 w-full">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import IconLogo from "@/components/icons/IconLogo.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: { IconLogo },
  setup() {
    const route = useRoute();

    const title = computed(() => {
      return route.meta.title as string;
    });

    const subtitle = computed(() => {
      return route.meta.subtitle as string;
    });

    return {
      title,
      subtitle,
    };
  },
});
</script>

<style scoped></style>
