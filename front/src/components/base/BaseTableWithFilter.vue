<template>
  <div>
    <div
      class="w-full p-4 border rounded flex items-center justify-between shadow"
    >
      <div class="space-x-4 flex">
        <div
          class="border rounded-lg py-2 px-5 flex space-x-4 bg-grey-20 w-[280px]"
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

        <div> 
          <slot name="filter">
            <BaseButton icon="upload" size="small">Télécharger</BaseButton>
          </slot>
          
        </div>

       
      </div>
      <BasePagination
        :peerPage="paginationData.peerPage"
        :totalElements="paginationData.total"
        @change="params.page = $event"
      />
    </div>

    <BaseTable :titles="titles" :data="items" :loading="loading" :actions="actions" class="mt-6">
      
      <template v-slot:[title.name] v-for="title in titles">
          
        <slot :key="title.name" :name="title.name" > </slot>
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import type { PropType } from "vue";
import BasePagination from "./BasePagination.vue";
import type { ITitle } from "./BaseTable.vue";
import { IAction } from "./BaseActions.vue";

export interface QueryParams {
  q: string;
  page: number;
}

export interface ResponseData<T> {
  data: Array<T>;
}

export type FetchData<T> = (params: QueryParams) => Promise<ResponseData<T>>;

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
    actions : {
            type : Array as PropType<Array<IAction>>
        }
  },
  setup(props) {
    const items = ref();

    const paginationData = reactive({
      total: 0,
      peerPage: 10,
    });

    const search = ref("");

    const params = reactive({
      q: "",
      peerPage: 10,
      page: 1,
    });

    const loading = ref(false);

    async function loadData() {
      params.peerPage = paginationData.peerPage;
      loading.value = true;
      try {
        items.value = await props.fetchData(params);
      } catch (error: any) {
        console.log({ ...error });
      }
    }

    onMounted(async () => {
      await loadData();
    });

    function onSearch() {
      console.log("make search");
    }
    return {
      paginationData,
      search,
      onSearch,
      params,
      items,
    };
  },
});
</script>

<style scoped></style>
