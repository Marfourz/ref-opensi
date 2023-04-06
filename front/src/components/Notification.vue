<template>
  <div class="flex gap-4">
  
    <div class="mb-4 flex-1">
      <div
        class="rounded-lg border border-primary flex gap-4 p-4 "
      >
        <BaseIcon name="accepter" class="bg-[#F0F0FA]  rounded-full"/>
        <div class="flex flex-1 justify-between items-center">
          <div class="">
            <p class="font-semibold">Votre commande #56767 a été accepté</p>
            <div class="flex mt-2 gap-4 mb-4">
              <BaseIcon name="calendar" />
              <span class="text-grey-50 font-semibold text-sm">Date de livraison : 22 Déc 2022</span>
            </div>
            
           <span class=""> <router-link to="" class=" rounded px-2 py-2 border-black border-2 font-semibold"
              >Voir détails</router-link
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">






</script>
