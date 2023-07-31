<template>
  <component :is="iconComponent"></component>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, defineAsyncComponent } from "vue";
import IconLoader from "@/components/icons/IconLoader.vue";
const props = defineProps<{
  name: string;
}>();

const iconComponent = computed(() => {
  return defineAsyncComponent({
    loader: () => import(`../icons/Icon${_.upperFirst(props.name)}.vue`),
    errorComponent: IconLoader,
    loadingComponent: IconLoader,
  });
});



</script>

<style scoped></style>
