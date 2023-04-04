<template>
  <Form class="space-y-6" @submit="onSubmit">
    <BaseInput name="email" 
    :customErrorMessage="errorMessage"
    v-model="email" rules="required|email" label="Email"></BaseInput>
    <BaseButton class="w-full"
      >Valider</BaseButton
    >
    <div
      class="underline text-primary font-bold text-left cursor-pointer"
      @click.stop="goToLogin"
    >
      Allez à la connexion
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../stores/users";
const router = useRouter();
function goToVerificationCode() {
  router.push({ name: "definePassword" });
}

function goToLogin() {
  router.push({ name: "login" });
}

const email = ref("")

const loading = ref(false)

const errorMessage = ref("")

const usersStore = useUsersStore()

async function onSubmit(){
      loading.value = true
      errorMessage.value = ""
      try{
        console.log('submit call')

        const response = await usersStore.sendResetPasswordCode(email.value)
        localStorage.setItem('email', email.value)
        router.push({
          name : 'passwordCode'
        })
      }
      catch(error : any){
        console.log('error', error.response.data)
        if(error.response.data.statusCode == 404)
          errorMessage.value = "L’adresse Email que vous avez saisie est incorrecte"
      }
      loading.value = false
    }
</script>

<style scoped></style>
