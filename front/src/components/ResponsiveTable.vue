<!-- <template>
  <div class="rounded border-1 border-l-8">
    <div
      class="left-0 w-2 rounded h-full"
      :style="`background-color: ${paramToUse.primaryColor}`"
    ></div>
    <div class="p-4">
      <div class="flex justify-between">
        <div class="space-x-2">
          <span
            class="w-4 h-4 bg-primary rounded-full"
            :style="`background-color: ${paramToUse.primaryColor}`"
            >.....</span
          >
          <span class="">{{ paramToUse.title }}</span>
        </div>
        <div class="">
          <BaseIcon name="triplePoints" class="cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export interface ITitle {
  title: string;
  name: string;
  transform?: Function;
}

import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import isEqual from "lodash/isEqual";
import { IAction } from "@/types/interfaces";
import { UserAccountStatus } from "@/types/enumerations";
import BaseActions from "@/components/base/BaseActions.vue";

type FilterActions<T> = (item: any) => Array<IAction>;

type Params = {
  title: string;
  primaryColor: String;
};

const MAPPING_OBJ: Record<UserAccountStatus, Params> = {
  active: {
    title: "actif",
    primaryColor: "primaryColor",
  },
  inactive: {
    title: "inactif",
    primaryColor: "danger",
  },
  suspended: {
    title: "suspendu",
    primaryColor: "danger",
  },
};

export default defineComponent({
   components: { BaseActions },
  props: {
    actions: {
      type: Array as PropType<Array<IAction>>,
    },

    statusTitle: {
      type: String,
    },
    type: {
      required: true,
      type: String as PropType<UserAccountStatus>,
    },
  },

  setup(props) {
    const paramToUse = MAPPING_OBJ[props.type];

    return {
      paramToUse,
    };
  },
});
</script>

<style lang="scss" scoped></style> -->


<template>
     <div class="rounded border-1  border-l-8">
       <div class="left-0 bg-black w-2 rounded h-full"></div> 
      <div class="p-4">
        <div class="flex justify-between">
          <div class="space-x-2">
            <span class="w-4 h-4 bg-primary rounded-full">.....</span>
            <span class="">inactif</span>
          </div>
          <div class="">
            <BaseIcon name="triplePoints" class="cursor-pointer" />
          </div>
        </div>
        
      </div>
    </div> 
</template>