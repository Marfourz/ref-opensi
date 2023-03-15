<template>
  <div class="h-screen w-scren flex flex-col">
    <HeaderBar />
    <div class="flex-1 flex h-[calc(100vh-56px)] overflow-hidden">
      <SideBar class="overflow-scroll"></SideBar>
      <RouterView
        class="w-full overflow-scroll"
        :class="{ 'px-6 py-8': !withoutPadding }"
      ></RouterView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import SideBar from "@/components/SideBar/index.vue";
import { useRoute } from "vue-router";
import { useUsersStore } from "../stores/users";

export default defineComponent({
  components: { HeaderBar, SideBar },
  setup() {
    const route = useRoute();
    const userStore = useUsersStore();
    const withoutPadding = computed(() => {
      return route.meta.withoutPadding;
    });

    onMounted(async () => {
      try {
        userStore.me();
      } catch (error: any) {}
    });
    return {
      withoutPadding,
    };
  },
});
</script>

<style scoped></style>
