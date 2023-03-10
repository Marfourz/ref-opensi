<template>
  <div class="my-6 sm:my-10 border-b pb-2 border-gray-200">
    
    <div class="flex items-center space-x-2 title text-lg font-bold text-primary mb-2" v-if="title">
      
      <div>{{ title }}</div>
      
      <slot name="action">
        
    </slot>
    </div>
    <div 
      class="grid gid-cols-1 md:grid-cols-3 gap-4" 
      :class="{'border-gray-200 bg-[#F4F6F9] rounded-lg pl-2 pt-1 pb-2':gray}" 
      v-if="hasDescriptions"
    >
      <div v-for="(description, i) in descriptions" :key="i">
        <BaseText :label="description.label" :value="description.value" :redirect="description?.redirect"/>
      </div>
    </div>
    <div class=""  v-if="hasOptions">
      <div v-for="(option, i) in options" :key="i" class="my-3 sm:my-5 last:border-b-0 border-b pb-4"  :class="{'border-gray-200 bg-[#F4F6F9] rounded-lg pl-2 pt-1':gray}">
        <div class="text-base font-bold  mb-4" v-if="options  && options.length>1"> {{ option.subtitle }}</div>
        <div class="grid gid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(description, i) in option.descriptions" :key="i">
            <BaseText :label="description.label" :value="description.value" :redirect="description?.redirect"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
interface IBaseTextGroup {
  value : string,
  label  : string
  redirect: any
}
interface IBaseOptionGroup {
  subtitle: string,
  descriptions: IBaseTextGroup[]

}
import { computed, defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String
    },
    descriptions: {
      type: Array as ()=>Array<IBaseTextGroup>
    },
    options: {
      type: Object as PropType<IBaseOptionGroup[]>
    },
    gray:{
      type:Boolean
    }
  },

  setup(props) {

    const hasOptions = computed(() => {
      return props.options && props.options?.length > 0
    })
    const hasDescriptions = computed(() => {
      return props.descriptions && props.descriptions?.length > 0
    })
    return {
      hasOptions,
      hasDescriptions
    }
  }
})
</script>