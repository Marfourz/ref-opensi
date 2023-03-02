<template>
  <div >    
    <div
      v-if="!hideFilter"
      class="w-full p-4 border rounded flex items-center justify-between shadow"
    >
      <div class="space-x-4 flex">
        <div
          class="border items-center rounded-lg py-2 px-5 flex space-x-4 bg-[#DADEE3] w-[280px]"
        >
          <BaseIcon name="search" class="text-grey-50"></BaseIcon>
          <input
            type="text"
            v-model="params.q"
            @input="onSearch"
            class="outiline-0 text-gray-700 focus:shadow-outline focus:outline-none w-full bg-transparent"
            placeholder="Rechercher"
          />
        </div>

        <div class="">
          <slot name="filter">
            <BaseButton icon="upload" size="small" class="h-full"
              >Télécharger</BaseButton
            >
          </slot>
        </div>
      </div>
      <BasePagination
        :peerPage="paginationData.peerPage"
        :totalElements="paginationData.total"
        @change="pageChange"
      />
    </div>
    <BaseTable
      :titles="titles"
      :data="items"
      :loading="loading"
      :actions="actions"
      class="mt-6"
    >
    
    <template v-for="(_, name) in slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  reactive,
  ref,
  useSlots,
  watch,
} from "vue";
import type { PropType } from "vue";
import BasePagination from "./BasePagination.vue";
import type { ITitle } from "./BaseTable.vue";
import { IAction } from "./BaseActions.vue";
import { PrimaryKey } from "../../types/interfaces";

export interface QueryParams {
  q: string;
  page: number;
}

export interface ResponseData<T> {
  count: number;
  data: Array<T>;
}

export type FetchData<T> = (
  params: QueryParams,
  id?: PrimaryKey
) => Promise<ResponseData<T>>;

export default defineComponent({
  components: { BasePagination },
  props: {
    fetchData: {
      type: Function as PropType<FetchData<any>>,
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
    requestId: {
      type: String as PropType<PrimaryKey>,
    },
    actions: {
      type: Array as PropType<Array<IAction>>,
    },

    hideFilter: {
      type: Boolean,
      default: false,
    },

    params: {
      type: Object,
    },
  },
  setup(props, context) {
    const items = ref();

    const count = ref(0);

    const paginationData = reactive({
      total: 0,
      peerPage: 10,
    });

    const search = ref("");

    const params = reactive({
      q: "",
      perPage: 10,
      page: 1,
    });

    const loading = ref(false);

    async function loadData() {
     
      
      params.perPage = paginationData.peerPage;

      loading.value = true;
      try {
        let response;
        if (!props.requestId) {
          response = await props.fetchData({ ...params, ...props.params });
        } else {
          response = await props.fetchData(
            { ...params, ...props.params },
            props.requestId
          );
          console.log("firstn response",response, props.requestId);
        }


        
        
        if (Array.isArray(response)) {
          items.value = response;
        } else {
          items.value = response.data;
          paginationData.total = response.count;
        }
        context.emit("total", items.value.length);
      } catch (error: any) {
        console.log({ ...error });
      }
    }

    watch(
      () => props.requestId,
      (newValue, oldValue) => loadData()
    );

    watch(
      () => props.params,
      (newValue, oldValue) => loadData()
    );

    function pageChange(value: number) {
      params.page = value;
      loadData();
    }

    onMounted(async () => {
      console.log("salut à tous");

      await loadData();
    });

    const slotDatas = computed(() => {
      const values = [] as Array<{
        title: string;
        element: Object;
      }>;

      if (props.titles && items.value) {
        items.value.forEach((data: any) => {
          props.titles.forEach((title) => {
            values.push({
              title: title.name,
              element: data,
            });
          });
        });
      }

      return values;
    });


    const slots = useSlots()

    function onSearch() {
      loadData();
    }
    return {
      paginationData,
      search,
      onSearch,
      params,
      items,
      pageChange,
      slotDatas,
      slots
    };
  },
});
</script>

<style scoped></style>
