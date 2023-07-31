<template>
  <div>
    <input
      type="file"
      ref="file"
      class="hidden"
      @input="uploadFile"
      multiple
      accept="image/png, image/jpeg"
    />

    <div
      class="border border-dashed border-primary p-4 flex justify-center rounded"
      v-if="!selectedFile.file && !onlineFile.url"
      @click="onSelectFile"
    >
      <div class="flex items-center space-x-4">
        <BaseIcon name="uploadFile"></BaseIcon>
        <div class="font-semibold">
          Cliquer ici pour ajouter une photo du produit
        </div>
      </div>
    </div>

    <div
      class="border border-dashed border-primary py-4 flex items-center justify-between rounded px-8"
      v-else
    >
      <div class="rounded h-10 w-10">
        <img
          :src="onlineFile.url"
          alt=""
          v-if="onlineFile && !selectedFile.link"
        />
        <img :src="selectedFile.link" alt="" class="h-10 w-10" v-else />
      </div>

      <div class="flex items-center space-x-8">
        <BaseButton
          size="small"
          class="w-fit space-x-6"
          :outline="true"
          @click.stop.prevent="onSelectFile"
          >Changer la photo</BaseButton
        >
        <div
          class="flex items-center space-x-2 cursor-pointer"
          @click="onDelete"
        >
          <BaseIcon
            name="close"
            class="text-[#EB5757] font-semibold"
          ></BaseIcon>
          <div>Supprimer</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import { useFileStore } from "@/stores/file";

export default defineComponent({
  props: {
    onlineFile: {
      type: Object,
      default: {},
    },
  },

  setup(props, context) {
    const file = ref();

    const fileStore = useFileStore();

    const selectedFile = ref({
      file: null,
      link: "",
    });

    async function uploadFile(event: any) {
      selectedFile.value.file = file?.value?.files[0];

      const pickReader = new FileReader();

      pickReader.addEventListener("load", function (event) {
        const picFile = event.target;
        console.log("files", picFile?.result);
        selectedFile.value.link = picFile?.result as any;
        context.emit("change", selectedFile.value.file);
      });
      pickReader.readAsDataURL(selectedFile.value.file as any);
    }

    function onDelete() {
      selectedFile.value = {
        file: null,
        link: "",
      };
      context.emit("change", null);
    }

    function onSelectFile() {
      file.value.click();
    }
    return {
      uploadFile,
      selectedFile,
      onSelectFile,
      file,
      fileStore,
      onDelete,
    };
  },
});
</script>

<style scoped></style>
