<template>
  <div>
    <div class="space-y-6 text-start ">
      <div class="font-semibold flex space-x-2.5">
        <div class="mt-1"><IconInfoPlus class="text-primary" /></div>
        <div >Entrez le code à 5 chiffres envoyé à {{ email }}</div>
      </div>
      <div class="space-y-6">
        <div
          class="bg-red-300 w-full rounded-lg p-4 text-red-700"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </div>
        <div class="text-center font-semibold text-[16px]">
          Code de vérification
        </div>
        <div class="flex justify-center">
        
          <v-otp-input
            
            ref="otpInput"
            input-classes="otp-input"
            v-model:value="code"
            separator=""
            :num-inputs="5"
            :should-auto-focus="true"
            :is-input-num="true"
            :conditionalClass="['one', 'two', 'three', 'four']"
            :placeholder="['*', '*', '*', '*', '*']"
            @on-complete="handleOnComplete"
          />
        </div>
      </div>

      <div class="w-full">
        <BaseButton class="w-full" @click="handleOnComplete" :loading="loading">Valider</BaseButton>
      </div>
    </div>

    <div
      class="underline font-semibold cursor-pointer text-primary text-start mt-6 ml-1"
      @click="goToLogin"
    >
      Allez à la connexion
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import VOtpInput from "vue3-otp-input";
import { useUsersStore } from "@/stores/users";
import { useToast } from "vue-toastification";
import IconInfoPlus from "@/components/icons/IconInfoPlus.vue"


export default defineComponent({
  components: { VOtpInput,IconInfoPlus },
  setup() {
    const email = ref("");
    const router = useRouter();
    const loading = ref(false);
    const usersStore = useUsersStore();
    const errorMessage = ref("");
    function goToLogin() {
      router.push({
        name: "login",
        
      });
    }

    const toast= useToast()

    const otpInput = ref();

    const code = ref("")

    const handleOnComplete = async (value: string) => {
      await localStorage.setItem("code", value);
      errorMessage.value = ""
      try {
        
        const user = await usersStore.verifyResetPasswordCode(
          email.value,
          code.value
        );

        router.push({
          name: "newPassword",
          query:{
          otp : code.value,
          username : email.value,
        }
        });
      } catch (error: any) {
        
        toast.error("Le code entré est incorrect");
      }

      console.log("OTP completed: ", value);
    };

    const clearInput = () => {
      otpInput.value.clearInput();
    };

    onMounted(async () => {
      email.value = (await localStorage.getItem("email")) as string;
    });

    return {
      email,
      goToLogin,
      router,
      loading,
      otpInput,
      handleOnComplete,
      clearInput,
      errorMessage,
      code
    };
  },
});
</script>

<style scoped>
.otp-input {
  width: 52px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-bottom: 2px solid #318f60;
  text-align: center;
  font-weight: bold;
}

.otp-input:focus {
  border: none;
}
/* Background colour of an input field with value */

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}

</style>
