<template>
   <component :is="iconComponent" ></component>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed,defineAsyncComponent } from 'vue';

    const props = defineProps<{
        name : string
    }>()

 

    const iconComponent = computed(()=>{
        return defineAsyncComponent(() => import(`../icons/Icon${_.upperFirst(props.name)}.vue`)
                                        .then((icon)=>icon.default)
                                        .catch(error =>import(`../icons/IconDefault.vue`)));
        
    })
</script>

<style scoped>

</style>