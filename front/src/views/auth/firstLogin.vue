<template>
    <div>
        <Form class="space-y-6 ">
            <BaseInput name="email" label="Email"></BaseInput>
            <div>
                <BaseInput name="mot de passe" label="Mot de passe" type="password"></BaseInput> 
                <div class="underline font-bold text-right text-sm text-blue-700">Mot de passe oublié</div>
            </div>
            
            <BaseButton class="w-full" @click="goToDefinePassword" >Se connecter</BaseButton>
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

function goToDefinePassword(){
    router.push({name : 'definePassword'})
}

</script>

<style scoped>

</style>