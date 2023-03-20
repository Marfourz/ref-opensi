<template>
  <div>
    <Form class="space-y-6" @submit="onSubmit">
      <BaseInput
        name="email"
        label="Email"
        rules="required"
        v-model="username"
      ></BaseInput>
      <div>
        <BaseInput
          name="mot de passe"
          rules="required"
          label="Mot de passe"
          type="password"
          v-model="password"
        ></BaseInput>
        <div
          class="underline font-bold text-right text-sm text-link cursor-pointer mt-1"
          @click="goToForgotPassword"
        >
          Mot de passe oublié
        </div>
      </div>

      <BaseButton class="w-full" :loading="loading">Se connecter</BaseButton>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form } from "vee-validate";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/users/auth-store";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const router = useRouter();

const authStore = useAuthStore();

const toast = useToast();

const username = ref("");

const password = ref("");

const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });

    router.push({ name: "dashboard" });

    loading.value = false;
  } catch (error:any) {
    if(error.response.status == 401){
      toast.error("Vos identifiants sont incorrects");
    }
    else
      toast.error("Un problème est survenu.Contactez l'administrateur.");
    
    console.log("error", error);
    loading.value = false;
  }
}

function goToForgotPassword() {
  router.push({ name: "forgotPassword" });
}
</script>

<style scoped></style>
