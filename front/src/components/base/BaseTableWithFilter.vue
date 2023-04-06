<template>
  <div class="h-full flex flex-col">
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
            <BaseButton
              icon="upload"
              size="small"
              class="h-full"
              @click="downloadData"
              :loading="downloadLoading"
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

    <div
      v-if="items && items.length == 0"
      class="h-full flex flex-col justify-center mt-6"
    >
      <EmptyState :title="emptyMessage" image=""></EmptyState>
    </div>

    <BaseTable
      :titles="titles"
      :data="items"
      :loading="loading"
      :actions="actions"
      :filterActions="filterActions"
      class="mt-6"
      v-else
      @itemClick="$emit('itemClick', $event)"
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
import { IAction } from "@/types/interfaces";
import { PrimaryKey } from "../../types/interfaces";
import EmptyState from "../EmptyState.vue";
import { useToast } from "vue-toastification";

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

export type DownloadData<T> = (
  params: QueryParams,
  id?: PrimaryKey
) => Promise<any>;

export default defineComponent({
  components: { BasePagination, EmptyState },
  props: {
    fetchData: {
      type: Function as PropType<FetchData<any>>,
      required: true,
    },
    downloadData: {
      type: Function as PropType<DownloadData<any>>,
      required: true,
    },
    titles: {
      type: Array as () => Array<ITitle>,
      required: true,
    },
    emptyMessage: {
      type: String,
      default: "Aucun élément ajouté pour l'instant",
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

    filterActions: {
      type: Function,
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
          console.log("firstn response", response);
        }

        if (Array.isArray(response)) {
          items.value = response;
        } else {
          items.value = response.data;
          paginationData.total = response.count;
        }

        loading.value = false;

        context.emit("total", items.value.length);
        context.emit("onFetch", items.value);
      } catch (error: any) {
        console.log({ ...error });
        loading.value = false;
      }
    }

    const downloadLoading = ref(false);

    const toast = useToast();
    async function downloadData() {
      params.perPage = paginationData.peerPage;
      downloadLoading.value = true;
      try {
        let response;
        if (!props.requestId) {
          response = await props.downloadData({ ...params, ...props.params });
        } else {
          response = await props.downloadData(
            { ...params, ...props.params },
            props.requestId
          );
        }
        downloadURI(response.url, "");
        downloadLoading.value = false;
      } catch (error: any) {
        console.log({ ...error });
        toast.error("Echec du téléchargement.");
        downloadLoading.value = false;
      }
    }

    const downloadURI = (uri: string, name: string) => {
      const link = document.createElement("a");
      // window.open("link");
      link.download = name;
      link.href = uri;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    };

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

    const slots = useSlots();

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
      slots,
      loading,
      downloadData,
      downloadLoading,
    };
  },
});
</script>

<style scoped></style>
