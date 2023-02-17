<template>
    <div>
      
      <RouterView />
    </div>
 
</template>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { RouterView } from "vue-router";


export default defineComponent({
  
  setup(){

  }
})
</script>



<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap');


#app {
  font-family: 'Montserrat', sans-serif;
  

}


</style>
