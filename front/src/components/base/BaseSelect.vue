<template>
  <div class="w-full space-y-2 ">
    <label for="" class="font-semibold w-full text-[#6B7A99] text-[14px]" v-if="label">{{ label }}</label>
    <div class="relative bg-white">
      <div
        class="flex justify-between items-center px-4 border py-2 rounded-md border-borderColor"
        @click="showElement = !showElement"
      >
      
        <input
          type="text"
          v-bind="$attrs"
          readonly
          :value="selected.title"
          class="focus:outline-none text-grey-70 w-full"
          style="font-weight: 600"
          v-if="selected"
        />
        <input
          v-else
          type="text"
          v-bind="$attrs"
          value=""
          readonly
          class="focus:outline-none text-grey-70 w-full"
          style="font-weight: 600"
        />
        <BaseIcon name="chevronDown"></BaseIcon>
      </div>

      <div
        class="absolute bg-white mt-1 w-full rounded-md shadow-xl max-h-64 overflow-auto"
        style="z-index: 2000"
        v-if="showElement"
      >
        <div
          class="md:py-3 py-2 px-4 text-left hover:bg-blue-50 cursor-pointer "
          v-for="(element, i) in items"
          :key="element.value"
          :class="{
            'rounded-t-md': i == 0,
            'rounded-b-md': i == items.length - 1,
          }"
          @click="selectElement(element)"
        >
          {{ element.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export interface ISelect {
  title: string;
  value: string;
}
import { defineComponent, ref, onUpdated,watch,onMounted } from "vue";
export default defineComponent({
 
  props: {
    modelValue: {
      type: String,
      required:true
    },
    label: {
      type: String,
    },
    items: {
      type: Array as () => Array<ISelect>,
      required: true,
    },
  },
  emits: ["update:modelValue"],


  setup(props, context) {
    const selected = ref();
    const showElement = ref(false);

    function selectElement(element: ISelect) {
      showElement.value = !showElement.value;
      selected.value = element;
      context.emit("update:modelValue", selected.value.value);
    }

    watch(()=>props.modelValue,(newValue)=>{
      
      
      const elementIndex = props.items.findIndex((value:ISelect)=>value.value == props.modelValue)

      console.log("new select value", newValue,props.items,elementIndex);
    
      if(elementIndex != -1)
        selected.value = props.items[elementIndex];
        
    })

    onMounted(() => {
        if(props.items && props.items.length > 0)
          selected.value = props.items[0];
    })

    return {
      selected,
      showElement,
      selectElement,
    };
  },
});
</script>

<style lang="scss" scoped></style>
