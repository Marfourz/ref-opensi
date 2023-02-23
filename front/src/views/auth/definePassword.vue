<template>
    <Form class="space-y-6"  @submit="onSubmit">
        <BaseInput name="mot de passe" label="Mot de passe" type="password" v-model="password" rules="required"></BaseInput> 
        <BaseInput 
            name="confirmation" 
            label="Confirmer le mot de passe" 
            type="password" rules="required" 
            v-model="confirmPassword"
            @input="onConfirmPasswordChange"
            :customErrorMessage="customErrorMessage"></BaseInput>   
        <BaseButton class="w-full" :loading="loading">Confirmer</BaseButton>
    </Form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Form } from "vee-validate"
import { onMounted, ref } from "vue";
import { useUsersStore } from "../../stores/users";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

    const router = useRouter()
    const route = useRoute()
    const token = ref("")
    const password = ref("")
    const username = ref("")
    const confirmPassword = ref("")
    const usersStore = useUsersStore()
    const loading = ref(false)
    const toast = useToast()

    const customErrorMessage = ref("")


    function onConfirmPasswordChange(){
       if(confirmPassword.value != password.value)
          customErrorMessage.value = "Les deux mots de passe ne sont pas identiques"
        else
          customErrorMessage.value = ""
    }

    async function onSubmit(){
        loading.value = true
        try{
                const response = await usersStore.definePassword({
                    username:username.value,
                    token : token.value,
                    password : password.value
            })
            loading.value = false
            router.push({name : 'login'})
        }
        catch(error : any){
            loading.value = false
            toast.error("Erreur innatendu")
        }
    }
     

    onMounted(()=>{
        token.value = route.query.t as string
        username.value = route.query.username as string
    })
</script>

<style lang="scss" scoped>

</style>