<template>
  <div
    class="border relative border-grey-90 focus-within:border-grey-90 rounded-lg flex"
    :style="'background-color:' + completeClass"
  >
    <div class="flex items-center w-full py-3">
      <div
        class="ml-3 flex items-center"
        :style="'background-color:' + completeClass"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1420_19531)">
            <path
              d="M1.25162 23.9995C0.938717 23.9995 0.625812 23.8731 0.375487 23.6205C-0.125162 23.1152 -0.125162 22.3257 0.375487 21.852L6.75876 15.4097C7.25941 14.9044 8.04168 14.9044 8.51104 15.4097C9.01169 15.915 9.01169 16.7045 8.51104 17.1782L2.12776 23.6205C1.90873 23.9047 1.56453 23.9995 1.25162 23.9995Z"
              fill="#636D84"
            />
            <path
              d="M14.0188 20.148C8.51166 20.148 4.03711 15.6321 4.03711 10.074C4.03711 4.51594 8.51166 0 14.0188 0C19.5259 0 24.0005 4.51594 24.0005 10.074C24.0005 15.6321 19.5259 20.148 14.0188 20.148ZM14.0188 2.49482C9.88845 2.49482 6.50907 5.90546 6.50907 10.074C6.50907 14.2426 9.88845 17.6532 14.0188 17.6532C18.1492 17.6532 21.5285 14.2426 21.5285 10.074C21.5285 5.87388 18.1492 2.49482 14.0188 2.49482Z"
              fill="#636D84"
            />
          </g>
          <defs>
            <clipPath id="clip0_1420_19531">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <input
        type="text"
        v-on="autoCompleteEvents"
        v-model="search"
        :placeholder="placeholder"
        class="focus:outline-none h-full px-2 rounded-lg w-full"
        :style="'background-color:' + completeClass"
      />
      <div
        class="mr-1 flex items-center"
        v-if="hasSearchValue && enableSeach && !hasSelectedOption"
        @click="resetSearch"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3007 5.70999C18.1139 5.52273 17.8602 5.4175 17.5957 5.4175C17.3312 5.4175 17.0775 5.52273 16.8907 5.70999L12.0007 10.59L7.1107 5.69999C6.92387 5.51273 6.67022 5.4075 6.4057 5.4075C6.14119 5.4075 5.88753 5.51273 5.7007 5.69999C5.3107 6.08999 5.3107 6.71999 5.7007 7.10999L10.5907 12L5.7007 16.89C5.3107 17.28 5.3107 17.91 5.7007 18.3C6.0907 18.69 6.7207 18.69 7.1107 18.3L12.0007 13.41L16.8907 18.3C17.2807 18.69 17.9107 18.69 18.3007 18.3C18.6907 17.91 18.6907 17.28 18.3007 16.89L13.4107 12L18.3007 7.10999C18.6807 6.72999 18.6807 6.08999 18.3007 5.70999Z"
            fill="#09101D"
          />
        </svg>
      </div>
    </div>
    <div
      class="absolute w-full shadow-lg top-10 left-0 bg-white rounded-b-lg border-x border-b border-borderColor"
      v-if="hasSearchValue && !hasSelectedOption"
    >
      <ul class="list-none px-0 p-2 pt-4">
        <template v-if="hasAnyOptions && enableSeach && !hasSelectedOption">
          <li v-for="(option, i) in options" :key="i" :tabindex="i">
            <div
              @keydown.enter="optionEvents.onEnterKeyDown($event, option)"
              @mousedown="optionEvents.onMouseDown($event, option)"
            >
              <slot
                name="option"
                :option="option"
                v-bind="{ optionEvents, getOptionLabel }"
              >
                <div
                  class="flex items-center cursor-pointer hover:bg-[#FFF3ED] active:bg-[#FFF3ED] p-4"
                >
                  <div v-html="getOptionLabel(option)"></div>
                </div>
              </slot>
            </div>
          </li>
        </template>
        <template v-else>
          <li>
            <div class="font-semibold text-base px-2">
              Aucune valeur ne correspond a votre recherche
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";

export default defineComponent({
  props: {
    fetchAutoCompleteData: {
      type: Function,
      default: (search: string) => {},
    },
    getOptionLabel: {
      type: Function,
      default: (option: any) => {},
    },
    completeClass: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  expose: ["resetSearch"],
  emits: ["change"],
  setup(props, ctx) {
    // ref
    const search = ref("");
    const options: Ref<any[]> = ref([]);
    const selectedOption = ref(null);
    const enableSeach = ref(true);

    // computed
    const hasAnyOptions = computed(() => options.value.length > 0);
    const hasSearchValue = computed(() => search.value.length > 0);
    const hasSelectedOption = computed(() => selectedOption.value !== null);

    const autoCompleteEvents = computed(() => ({
      input: onAutoCompletInput,
      keydown: onAutoCompleteKeyDown,
    }));

    const optionEvents = computed(() => ({
      onMouseDown: onOptionMouseDown,
      onEnterKeyDown: onOptionEnterClick,
    }));

    // fonc
    function onAutoCompletInput(e: InputEvent) {
      console.log("onAutoCompletInput ----> ", search.value);
      //search.value = (e.target as HTMLInputElement)?.value;
      selectedOption.value = null;
      if (enableSeach.value) {
        onFetchAutoCompleteData(search.value);
      }
    }
    function onAutoCompleteKeyDown(e: KeyboardEvent) {
      if (e.code === "Enter") {
        e.preventDefault();
      }
    }

    function onFetchAutoCompleteData(value: string) {
      props.fetchAutoCompleteData(value).then((response: any[]) => {
        options.value = response;
      });
    }

    function onOptionMouseDown(e: MouseEvent, option: any) {
      // console.log('onOptionMouseDown event ---> ', e);
      // console.log('onOptionMouseDown option ---> ', option);

      select(option);
    }
    function onOptionEnterClick(e: KeyboardEvent, option: any) {
      select(option);
    }
    function resetSearch(e: MouseEvent) {
      // if (enableSeach.value) {
      //   search.value = ""
      //   onFetchAutoCompleteData(search.value)
      // } else {
      //   enableSeach.value = false;
      //   search.value = ""
      // }
      search.value = "";
      selectedOption.value = null;
      onFetchAutoCompleteData(search.value);
    }

    function select(option: any) {
      selectedOption.value = option;

      enableSeach.value = false;

      search.value = props.getOptionLabel(option);

      ctx.emit("change", option);
      setTimeout(() => {
        enableSeach.value = true;
      }, 200);
    }

    return {
      search,
      enableSeach,
      hasAnyOptions,
      hasSelectedOption,
      hasSearchValue,
      options,
      autoCompleteEvents,
      optionEvents,
      resetSearch,
    };
  },
});
</script>
