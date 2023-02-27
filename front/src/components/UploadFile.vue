<template>
  <div>
    <input
      type="file"
      ref="file"
      class="hidden"
      @input="uploadFile"
      multiple
      accept="image/png, image/jpeg, video/mp3, video/mp4"
    />

    <div
      class="border border-dashed border-black py-4 flex justify-center rounded"
      v-if="!selectedFile.file && !onlineFile.link"
      @click="onSelectFile"
    >
      <div class="flex items-center space-x-4">
        <BaseIcon name="uploadFile"></BaseIcon>
        <div class="font-semibold">
          Cliquer ici pour ajouter une photo du produit
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center space-y-4" v-else>
      <div class="rounded">
        <img
          :src="fileStore.getFileLink(onlineFile.link)"
          alt=""
          class="rounded "
          v-if="onlineFile && !selectedFile.link"
        />
        <img
          :src="selectedFile.link"
          alt=""
          class="rounded "
          v-else
        />
      </div>

      <BaseButton size="small" class="w-fit" :outline="true" @click.stop.prevent="onSelectFile"
        >Changer l'image</BaseButton
      >
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

    function onSelectFile() {
      file.value.click();
    }

    return {
      uploadFile,
      selectedFile,
      onSelectFile,
      file,
      fileStore,
    };
  },
});
</script>

<style scoped></style>
