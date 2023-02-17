<template>
    <div>
        <Form class="space-y-6 " @submit="onSubmit">
            <BaseInput name="email" label="Email" v-model="username"></BaseInput>
            <div>
                <BaseInput name="mot de passe" label="Mot de passe" type="password" v-model="password"></BaseInput> 
                <div class="underline font-bold text-right text-sm text-link cursor-pointer mt-1" @click="goToForgotPassword">Mot de passe oublié</div>
            </div>
            
            <BaseButton class="w-full" :loading="loading">Se connecter</BaseButton>
        </Form>
       
        
        
    </div>
</template>

<script setup lang="ts">
import BaseIcon from '../../components/base/BaseIcon.vue';
import BaseButton from '../../components/base/BaseButton.vue';
import BaseInput from '../../components/base/BaseInput.vue';
import {Form} from "vee-validate"
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/users/auth-store';
import { ref } from 'vue';

const router = useRouter()

const authStore = useAuthStore()

const username = ref("")

const password = ref("")

const loading = ref(false)

async function onSubmit(){
    loading.value = true
    try{
        await authStore.login({
        username : username.value,
        password : password.value
    })

    loading.value = false
    }
    catch{
        loading.value = false
    }
    
}

function goToForgotPassword(){
    router.push({name : 'forgotPassword'})
}

</script>

<style scoped>

</style>