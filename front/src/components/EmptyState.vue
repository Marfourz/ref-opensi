<template>
<<<<<<< HEAD
    <div class="flex flex-col  items-center space-y-4">
        
        <img src="@/assets/images/emptyProduct.png" alt="">
        <div class="font-semibold text-center " v-html="title"></div>
    </div>
=======
  <div class="flex flex-col items-center space-y-4">
    <img :src="imageUrl" alt="" />
    <div class="font-semibold text-center" v-html="title"></div>
  </div>
>>>>>>> main
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    image: {
      type: String,
      required: true,
    },

<<<<<<< HEAD
        //const imageUrl = ref(new URL("/assets/images/emptyProduct.png", import.meta.url).href)
        
        onMounted(()=>{
            //imageUrl.value = new URL(props.image, import.meta.url).href
        })

        return {
            //imageUrl
        }
    }
})
=======
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const imageUrl = ref(
      new URL("/assets/images/emptyProduct.png", import.meta.url).href
    );

    onMounted(() => {
      imageUrl.value = new URL(props.image, import.meta.url).href;
    });

    return {
      imageUrl,
    };
  },
});
>>>>>>> main
</script>

<style scoped></style>
