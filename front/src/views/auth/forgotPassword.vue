<template>
  <Form class="space-y-6">
    <BaseInput name="email" rules="required|email" label="Email"></BaseInput>
    <BaseButton class="w-full" @click="goToVerificationCode"
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
import { useRouter } from "vue-router";
const router = useRouter();
function goToVerificationCode() {
  router.push({ name: "definePassword" });
}

function goToLogin() {
  router.push({ name: "login" });
}
</script>

<style scoped></style>
