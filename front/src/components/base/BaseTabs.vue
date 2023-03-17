<!-- tiny and simple tabs made with tailwindcss -->
<!--
tabs property is required

inactiveTab & activeTab are optional, set to change appearance

just all;

-->

<template>

  <div class="tld-tabs bg-white text-[16px]">
    
    <div class="w-full">
      <!-- <div>{{ selectedTab }}</div> -->
      <!-- tabs button -->
      <ul
        class="tld-tabs-buttons m-0 list-none select-none flex flex-wrap flex-row "
      >
        <li
          v-for="tab in tabs"
          :key="tab.name"
          class="tld-tab-button cursor-pointer py-2 px-6 text-center hover:bg-fadeSecondary min-w-[178px]"
          :class="dynamicClass(tab.name)"
          @click="toggleTabs(tab.name)"
        >
        <!-- <div class="flex space-x-2 justify-center items-center"> -->
           <!-- <div class="font-bold text-white rounded-full bg-[#E26018] flex items-center justify-center  font-mono" style="height: 25px; width: 25px; font-size: 16px;">{{tabs.indexOf(tab)+1}}</div> -->
          <span class="leading-[1.063rem] font-semibold">
            {{ tab.libelle }}
          </span>
        <!-- </div> -->
       
        </li>
      </ul>
      <!-- tabs area -->
      <div
        class="relative tld-tabs-tab-content tld-tabs-tab-space w-full"
        :class="`tld-active-tab-${openTab}`"
      >
        <slot :name="openTab" :item="openTab"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref,
  toRef,
  toRefs,
  onMounted,
  computed,
  watch,
  watchEffect,
} from "vue";

export default {
  name: "tailwind-tabs",
  props: {
    tabs: {
      type: [Array, Object],
      default: () => [],
      required: true,
    },

    inactiveTab: {
      type: String,
      default: "text-09101D bg-white  border border-[#A2A9B8] text-[#6B7A99] border-b-2",
    },

    activeTab: {
      type: String,
      default: "text-005743 bg-D9F2EC border-b-2 border-primary text-primary font-bold",
    },
    selectedTab: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const Tabs = toRef(props, "tabs");
    
    const openTab = ref();
    
    const activeTab = toRef(props, "activeTab");
    const inactiveTab = toRef(props, "inactiveTab");
    const selectedTab = toRef(props, "selectedTab")

    watch((Tabs), (newValue)=>{
      console.log("dsdssss")
      openTab.value = Tabs.value[0].name
    })

    watch(selectedTab, (newValue) => {
      console.log("WATCH", newValue);
      openTab.value = newValue;
    });


    const dynamicClass = (tabname) => {
      if (tabname === openTab.value) return activeTab.value;
      return inactiveTab.value;
    };

    const toggleTabs = (tab) => {
      openTab.value = tab;
      emit("change", openTab.value);
    };


   

   
    onMounted(()=>{
      
      openTab.value = selectedTab.value;
      emit("change", openTab.value);
    })

    return {
      openTab,
      dynamicClass,
      toggleTabs,
    };
  },
};
</script>
