<template>
    <div>
        <Form class="space-y-6 " @submit="goToForgotPassword">
            <BaseInput name="email" label="Email"></BaseInput>
            <div>
                <BaseInput name="mot de passe" label="Mot de passe" type="password"></BaseInput> 
                <div class="underline font-bold text-right text-sm text-link cursor-pointer mt-1" @click="goToForgotPassword">Mot de passe oublié</div>
            </div>
            
            <BaseButton class="w-full" >Se connecter</BaseButton>
        </Form>
       
        
        
    </div>
</template>

<script setup lang="ts">
import BaseIcon from '../../components/base/BaseIcon.vue';
import BaseButton from '../../components/base/BaseButton.vue';
import BaseInput from '../../components/base/BaseInput.vue';
import {Form} from "vee-validate"
import { useRouter } from 'vue-router';

const router = useRouter()

function goToForgotPassword(){
    router.push({name : 'forgotPassword'})
}

</script>

<style scoped>

</style>