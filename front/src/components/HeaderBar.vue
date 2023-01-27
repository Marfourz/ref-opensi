<template>
  <header class="fixed flex items-center p-8 w-full h-14">
    <nav class="w-full flex justify-between">
      <IconLogo />
      <div class="flex space-x-2">
        <div class="flex items-center space-x-1">
          <IconProfile />
          <span class="bg-gray-400 separator"></span>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-black">Samuel Tossou</span>
            <span class="text-sm text-gray-400">Master distributeur</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang setup>
import IconLogo from "./icons/IconLogo.vue";
import IconProfile from "./icons/IconProfile.vue";
</script>

<style scoped>
.separator {
  width: 2px;
}
</style>