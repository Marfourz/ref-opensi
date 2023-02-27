<template>
  <div>
    <div>
      <BaseButton icon="ArrowLeft" size="small">Retour</BaseButton>
      <div class="mt-3">
        <div class="flex justify-start space-x-4">
          <span>name</span>
          <span>statuts</span>
        </div>
        <div class="flex justify-end">
          <BaseButton size="small">Désactivé</BaseButton>
        </div>
      </div>
    </div>

    <!-- <div class="pt-8">
        
      <BaseTabs :tabs="tabs" @change="categoryId = $event">
        <template #[tab.name] v-for="tab in tabs">
          <BaseTableWithFilter
            :key="tab.name"
            :fetchData="productStore.fetchAllProductsStock"
            :titles="titles"
            :actions="actions"
            :requestId="organisationId"
            @total="total = $event"
            :params="{categoryId:categoryId}"
            class="mt-6"
          >
            <template #image="element">
             
              <div class="flex justify-center">
                <img :src="element.image" alt="" />
              </div>
            </template>
          </BaseTableWithFilter>
        </template>
      </BaseTabs>
    </div> -->
  </div>
</template>

<script>
export default {};
</script>

<style></style>
