<template>
    <Form class="space-y-6"  @click="goToLogin">
        <BaseInput name="mot de passe" label="Mot de passe" type="password"></BaseInput> 
        <BaseInput name="mot de passe" label="Confirmer le mot de passe" type="password"></BaseInput>   
        <BaseButton class="w-full">Confirmer</BaseButton>
    </Form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Form } from "vee-validate"

    const router = useRouter()
    function goToLogin(){
        router.push({name : 'login'})
    }
</script>

<style lang="scss" scoped>

</style>