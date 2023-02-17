<template>
     <div class="border rounded-lg py-2.5 px-4 flex space-x-1.5 bg-grey-10">
            <IconSearch class="text-grey-30"/>
            <input
            v-bind="{ ...$attrs }"
              type="text"
              v-model="search"
              @input="onSearch"
              class="outiline-0 text-gray-700 focus:shadow-outline focus:outline-none w-full bg-transparent"
              placeholder="Rechercher"
            />
            
          </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'
import IconSearch from './icons/IconSearch.vue';

export default defineComponent({
    components:{IconSearch},
    emits: ["update:modelValue"],
    props:{
        modelValue: {
        type: String,
        }   ,
    },
    setup (props,context) {
        const search = ref('')
        function onSearch(){
            console.log("ss");
            
            context.emit("update:modelValue", search.value);
        }
        return {
            search,
            onSearch
        }
    }
})
</script>

<style scoped>

</style>