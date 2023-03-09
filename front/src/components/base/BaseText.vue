<template>
    <div :class="['w-full flex', inline ? 'flex-col md:flex-row': 'flex-col']">
      <div :class="['text-gray-80 font-semibold  text-xs  md:text-sm', inline ? 'mr-2': '']" v-html="label"></div>
  
      <div class="text-xs md:text-sm">
        <slot >
          <div class="text-grey-70" @click="redirectFunction(redirect)" v-html="value"></div>
        </slot>
      </div>
    </div>
</template>
<script lang="ts">
import Vue, { defineComponent } from 'vue'
export default defineComponent({
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    redirect: {
      type: [Object],
      default: null
    }
  },

  methods: {
    redirectFunction (redirect: any) {
      console.log("redirect", redirect)
      if(redirect) this.$router.push(this.redirect)
    }
  }
})
</script>