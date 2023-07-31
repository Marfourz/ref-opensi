<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper" @click.self="onBgClose">

        <div class="modal-container w-full" :style="isMobile ? 'width:' + width : 'width:100%'" >
         
          <slot name="modal">
            <div class="modal-header relative">
              <div class="flex justify-between">
                <slot name="header">
                  <div v-if="title" class="text-black font-semibold text-2xl">
                    {{ title }}
                  </div>
                  <div v-else></div>
                </slot>
                <div class="w-5 cursor-pointer" @click="$emit('close')">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.29289 8.29295C8.68342 7.90243 9.31658 7.90243 9.70711 8.29295L23.7071 22.293C24.0976 22.6835 24.0976 23.3166 23.7071 23.7072C23.3166 24.0977 22.6834 24.0977 22.2929 23.7072L8.29289 9.70717C7.90237 9.31664 7.90237 8.68348 8.29289 8.29295Z"
                      fill="black"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M23.7071 8.29295C24.0976 8.68348 24.0976 9.31664 23.7071 9.70717L9.70711 23.7072C9.31658 24.0977 8.68342 24.0977 8.29289 23.7072C7.90237 23.3166 7.90237 22.6835 8.29289 22.293L22.2929 8.29295C22.6834 7.90243 23.3166 7.90243 23.7071 8.29295Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="modal-body">
              <slot>default body</slot>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script lang="ts">
import { defineComponent,computed } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "Modal title",
    },
    width: {
      type: String,
      default: "500px",
    },

    bgClose: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["close"],
  setup(props, ctx) {
    function onBgClose() {
      if (props.bgClose) {
        ctx.emit("close");
      }
    }

    const isMobile = computed(()=>{
      return window.matchMedia('(min-width: 768px)').matches
    })

    return {
      onBgClose,
      isMobile
    };
  },
});
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: block;
  /* vertical-align: middle; */
  height: 100%;
  overflow-y: scroll;
}

.modal-container {
  margin: 0px auto;
  margin-top: 5%;
  padding: 32px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
