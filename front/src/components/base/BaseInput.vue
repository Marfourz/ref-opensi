<template>
    <Field :name="name" :rules="rules" v-slot="{ field, errorMessage, errors }" > 
      <div class="text-left flex flex-col w-full">
        <label for="" v-if="label" class="mb-2 font-semibold text-[#6B7A99] text-[14px]" 
          >{{ label }}<span class="text-danger" v-if="isRequired"> *</span>
          <span class="text-grey text-xs">{{ optionalText }}</span></label
        >
        <div
          class="border rounded-lg w-full"
          :class="{
            'border-borderColor': errors.length == 0,
            'border-danger bg-fadeDanger': errors.length != 0,
          }"
          v-if="type == 'textarea'"
        >
          <textarea
            name=""
            id=""
            v-bind="{ ...$attrs, ...field }"
            rows="4"
            class="p-4 w-full outiline-none focus:shadow-outline rounded-lg focus:outline-none bg-transparent"
          >
          </textarea>
        </div>
        <div
          v-else-if="type == 'date'"
          class="border rounded-lg w-full flex items-center justify-between px-4 py-3"
          :class="{
            'border-borderColor': errors.length == 0,
            'border-danger bg-fadeDanger': errors.length != 0,
          }"
        >
          <!-- <BaseIcon :icon="icon" v-if="icon"></BaseIcon>  :min-date="mindate" :max-date="maxdate"-->
          <v-date-picker
            v-bind="{ ...$attrs, ...field }"
            class="w-full"
            :min-date="mindate"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <input
                :value="inputValue"
                v-on="inputEvents"
                class="outline-0 text-gray-700 focus:shadow-outline bg-transparent focus:outline-none w-full"
              />
            </template>
          </v-date-picker>
          <BaseIcon icon="date-range"></BaseIcon>
        </div>
  
        <div
          v-else
          class="flex items-center outiline-0 p-2 focus:shadow-outline rounded-lg border focus:outline-none space-x-2 appearance-none bg-transparent"
          :class="{
            'border-borderColor': errors.length == 0,
            'border-danger bg-fadeDanger':
              errors.length != 0 || customErrorMessage,
          }"
        >
          <BaseIcon :icon="icon" v-if="icon"></BaseIcon>
          <input
            v-bind="{ ...$attrs, ...field }"
            :type="inputType"
            ref="input"
            :class="[
              'outiline-0 text-gray-700 focus:shadow-outline bg-transparent focus:outline-none w-full',
              errors.length === 0 ? 'bg-white' : 'bg-fadeDanger',
            ]"
          />
          <BaseIcon :icon="iconRigth" v-if="iconRigth"></BaseIcon>
          <div @click="show = !show" v-if="type == 'password'" class="flex">
            <IconCloseEye icon="eye-close" v-if="show" class="w-6 h-6"></IconCloseEye>
  
            <IconEye icon="eye" v-else></IconEye>
          </div>
        </div>
  
        <div
          v-if="errors.length != 0 || customErrorMessage"
          class="flex items-center space-x-1 py-1 text-sm  rounded-lg bg-[#FEEFEF]  px-4 mt-2"
        >
          <IconInfoPlus class="text-red-900"/>
  
          <div class="text-danger" v-if="errors.length != 0">
            {{ errorMessage }}
          </div>
          <div class="text-danger" v-else>{{ customErrorMessage }}</div>
        </div>
      </div>
    </Field>
  </template>
  
  <script>
  import { Field } from "vee-validate";
  import IconCloseEye from "@/components/icons/IconCloseEye.vue";
  import IconEye from "@/components/icons/IconEye.vue";
  import IconInfoPlus from "@/components/icons/IconInfoPlus.vue";
  export default {
    data() {
      return {
        show: this.type != "password",
      };
    },
    props: {
      type: {
        type: String,
        default: "text",
      },
      mindate: {
        type: String,
        default: undefined,
      },
      maxdate: {
        type: String,
        default: undefined,
      },
      label: {
        type: String,
      },
      name: {
        type: String,
      },
      rules: {
        type: String,
      },
      icon: {
        type: String,
      },
      iconRigth: {
        type: String,
      },
      optionalText: {
        type: String,
      },
      customErrorMessage: {
        type: String,
        default: "",
      },
      dataPattern:{
        type: String,
      }
    },
    computed: {
      isRequired() {
        if (this.rules && this.rules.split("|").includes("required")) return true;
        return false;
      },
      isValid() {
        if (this.rules && this.rules.split("|").includes("valid")) return true;
        return false;
      },
      isPassword() {
        console.log("this is rules", this.rules);
        if (this.rules && this.rules.split("|").includes("password")) return true;
        return false;
      },
  
      inputType() {
        if (this.type != "password") return this.type;
        else {
          if (!this.show) return "password";
          else return "text";
        }
      },
    },
    methods: {
      inputChange(value) {
        this.$emit("input", value);
        console.log("this.$validator");
      },
      patternMatch({ input, template }) {
        try {
          let j = 0;
          let plaintext = "";
          let countj = 0;
          while (j < template.length) {
            if (countj > input.length - 1) {
              template = template.substring(0, j);
              break;
            }
  
            if (template[j] == input[j]) {
              j++;
              countj++;
              continue;
            }
  
            if (template[j] == "x") {
              template =
                template.substring(0, j) +
                input[countj] +
                template.substring(j + 1);
              plaintext = plaintext + input[countj];
              countj++;
            }
            j++;
          }
  
          return template;
        } catch {
          return "";
        }
      },
  
      
    },
    mounted() {
      if (this.type == "number") {
        this.$refs.input.addEventListener("keydown", function (event) {
          console.log("event", event);
          if (
            !String(event.code).startsWith("Digit") &&
            !["Backspace", "Control", "Enter", "Alt", "Meta", "Tab"].includes(
              event.key
            ) &&
            !isNaN(parseInt(event.key)) &&
            event.keyCode >= 48 &&
            event.keyCode <= 57
          ) {
            event.preventDefault();
          }
  
          // if (/[^0-9]/.exec(letter) && letter !== "Backspace")
          //   event.preventDefault();
        });
      
      }
  
      
  
  
    },
    components: {
      Field,
      IconInfoPlus,
      IconCloseEye,
      IconEye
  },
  };
  </script>
  
  <style scoped></style>
  