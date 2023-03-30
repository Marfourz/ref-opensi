<template>
  <div class="w-full overflow-auto flex-1 bg-white text-[14px]">
   
    <table class="table-auto w-full text-md">
      <thead>
        <tr class="bg-grey-10 text-tableColor">
          <th v-if="selectable" class="p-2">
            <input
              type="checkbox"
              class="cursor-pointer"
              v-model="checkedAll"
            />
          </th>
          <th
            v-for="title in titles"
            :key="title.name"
            class="py-4 border-b text-left pl-2 font-semibold "
          >
            {{ title.title }}
          </th>
        </tr>
      </thead>

      <tbody v-if="loading">
        <tr>
          <td :colspan="titles.length">
            <div class="w-full flex justify-center mt-10 font-bold">
              Chargement en cours ....
            </div>
          </td>
        </tr>
      </tbody>
      <tbody class="bg-white" v-else-if="data && data.length != 0">
        <tr
          v-for="(element, i) in data"
          class="font-semibold cursor-default hover:bg-[#EDEFF3]"
          :key="i"
          :class="{
            'bg-[#F8F9FB]': isEqual(element, currentElement) && actions,
            'border-b font-semibold ': i != data.length - 1,
          }"
          @mouseenter="currentElement = element"
          @click="onItemClick(element)"
        >
          <td v-if="selectable">
            <div class="p-2 flex justify-center items-center">
              <input
                type="checkbox"
                class="cursor-pointer"
                @change="onCheckedElement(element, $event)"
                :checked="
                  verifyElementExistInArray(element, checkedElements)
                    ? true
                    : false
                "
              />
            </div>
          </td>
          <td
            v-for="title in titles"
            :key="title.name"
            class="py-4 text-left pl-2 "
          >
            <div v-if="title.name != 'action'" class="max-w-xs ">
              <slot :name="title.name" :element="{ ...element, index: i }">
                <!-- {{ element[title.name] }} -->
                <div v-html="getElementValue(title, element, i)"></div>
              </slot>
            </div>

            <div v-else-if="isEqual(element, currentElement)" class="max-h-4 ">
              <slot name="action" :element="element">
                <div class="flex items-center justify-center">
                  <div class=" absolute">
                  <BaseActions :actions="getActions(element)" :data="element">
                  </BaseActions>
                </div>
                </div>
               
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody class="bg-white" v-else>
        <tr class="">
          <td :colspan="titles.length">
            <div class="w-full text-center p-8 shadow">
              Aucun élément trouvé
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
//import BaseActions from "../../components/base/BaseActions.vue";

type FilterActions<T> = (item : any) => Array<IAction>

export default defineComponent({
 // components: { BaseActions },
  props: {
    data: {
      type: Array as () => Array<any>,
      required: true,
    },
    titles: {
      type: Array as () => Array<ITitle>,
      required: true,
    },
    emptyMessage: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array as PropType<Array<IAction>>,
    },
    filterActions:{
      type : Function as PropType<FilterActions<any>>

    },
  },

  expose: ["resetSelection","itemClick"],

  setup(props, context) {
    const currentElement = ref();
    const checkedAll = ref(false);
    const checkedElements = ref<Array<any>>([]);

    function onCheckedElement(element: any, event: any) {
      if (verifyElementExistInArray(element, checkedElements.value)) {
        checkedElements.value = checkedElements.value.filter(
          (value) => JSON.stringify(value) != JSON.stringify(element)
        );
      } else checkedElements.value.push(element);
      context.emit("checkedElement", checkedElements.value);
    }

    const resetSelection = () => {
      onResetSelection();
    };

    function onResetSelection() {
      checkedElements.value = [];
      context.emit("checkedElement", checkedElements.value);
    }

    function getElementValue(title: ITitle, element: any, index: number) {
      if (title.transform && typeof title.transform === "function") {
        return title.transform(element, index);
      }
      return getValue(element, title.name);
    }

    function getValue(obj: any, path: string) {
      let current = obj,
        i;
      if (path) {
        const paths = path.split(".");
        for (i = 0; i < paths.length; ++i) {
          if (current[paths[i]] == undefined || current[paths[i]] == null) {
            return "";
          } else {
            current = current[paths[i]];
          }
        }
      }
      return current;
    }

    function verifyElementExistInArray(element: any, elements: Array<any>) {
      return elements.find(
        (value) => JSON.stringify(value) == JSON.stringify(element)
      );
    }

    function onMounted() {
      if (props.data.length != 0) currentElement.value = props.data[0];
    }

    function onItemClick(element: any) {
      console.log("yoy yoy");
      
      context.emit("itemClick",element)
    }

    //watchers
    watch(checkedAll, (newValue) => {
      if (newValue) checkedElements.value = props.data;
      else checkedElements.value = [];
      context.emit("checkedElement", checkedElements.value);
    });

    function getActions(element : any){
      if(props.filterActions)
        return props.filterActions(element)
      else
        return props.actions
    }

    return {
      currentElement,
      getElementValue,
      resetSelection,
      isEqual,
      checkedAll,
      onCheckedElement,
      checkedElements,
      verifyElementExistInArray,
      onItemClick,
      getActions
    };
  },
});
</script>

<style lang="scss" scoped></style>
