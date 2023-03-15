

<template>
    <div class="flex gap-4">
        <div class="flex justify-center flex-col ">
            <div class="bg-fadePrimary p-1.5 rounded-full">
                <div class="w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <div class="flex-1  relative ">
                <div class="absolute h-full border-dashed border-r-2 border-primary translate-x-1/2 right-1/2"></div>
            </div>
        </div>
        <div class="mb-4 flex-1">
            <span class="text-grey-50 text-xs">22 Avril, 10:12</span>
            <div class="rounded-lg border border-primary flex gap-4 p-4 bg-fadePrimary">
                <BaseIcon name="deposit" />
                <div class="flex flex-1 justify-between items-center">
                    <div class="">
                        <p class="font-semibold">Vente</p>
                        <div class="inline-block border-r text-grey-50 pr-2 mr-2">Nombre de casier: <span
                                class="text-black">100</span>
                        </div>
                        <router-link to="" class="text-[#2062F6] font-semibold">Voir détails</router-link>
                    </div>
                    <span class="text-xl font-bold text-primary">500 000 FCFA</span>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">

</script>