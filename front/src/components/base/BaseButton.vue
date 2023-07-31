<template>
  <button
    :class="classes"
    v-bind="$attrs"
    :disabled="disabled"
    class="flex items-center justify-center md:min-w-[120px]"
    @click="onClick"
  >
    <div v-if="!loading" class="flex md:space-x-2 items-center">
      <BaseIcon :name="icon" v-if="icon != ''"></BaseIcon>
      <div><slot></slot></div>
    </div>

    <!-- <img src="@/assets/images/loader.gif" alt="" v-else class="w-5 h-5" /> -->
    <div class="w-4" v-else>
      <BaseIcon name="loader"></BaseIcon>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import _ from "lodash";
// import BaseIcon from "./BaseIcon.vue";

interface Props {
  size?: "small" | "medium" | "large";
  bgColor?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  outline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "large",
  bgColor: "primary",
  disabled: false,
  loading: false,
  icon: "",
  outline: false,
});

const classes = computed(() => {
  return {
    "py-3.5 rounded-lg px-4": props.size == "large",
    "py-3 rounded-lg px-4": props.size == "medium",
    "py-1.5 rounded-md px-4 text-sm": props.size == "small",
    [`bg-${props.bgColor || "primary"} text-white`]:
      !props.disabled && !props.outline,
    [`bg-fade${_.capitalize(props.bgColor) || "bg-fadePrimary"} text-black`]:
      props.disabled,
    [`border border-${props.bgColor || "primary"} bg-white text-${
      props.bgColor
    } `]: props.outline,
  };
});

function onClick(event: any) {
  if (props.loading) event.preventDefault();
}
</script>

<style scoped></style>
