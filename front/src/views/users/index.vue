<template>
  
        <div class=" space-y-6">
            <BaseTitle title="Utilisateurs"></BaseTitle>
            <BaseButton icon="plus" size="small" @click="showModal = true">Nouveau utilisateur</BaseButton>
            <BaseTableWithFilter :titles="titles" :fetchData="userStore.fetchAll">
                <template #action >
                    <BaseIcon name="triplePoints"></BaseIcon>
                </template>

                <template #filter>
                    <div class="flex space-x-4 h-full">
                        <div class="flex border rounded items-center justify-center px-2">Filtré par</div>
                        <BaseButton icon="upload" size="small">Télécharger</BaseButton>
                        <BaseButton icon="plus" size="small">Nouveau distributeur</BaseButton>
                    </div>
                </template>
               
            </BaseTableWithFilter>

            <div class="fixed -top-10 bottom-0 right-0 left-0 bg-black opacity-50" v-if="showModal"></div>

            <div class="bg-white flex justify-center pt-10 fixed bottom-0 left-0 right-0 top-12 rounded-t-2xl overflow-scroll" v-if="showModal">
                <div class="w-[80%]">
                    <div class="border-b pb-2 flex items-center justify-between">
                        <div class="font-bold text-2xl">Ajouter un utilisateur</div>
                        <BaseIcon name="close" class="w-5 h-5" @click="showModal = false"></BaseIcon>
                    </div>
                    <div class="flex justify-center pt-6  ">
                        <Form class="w-3/4 space-y-6" @submit="onSubmit">
                        
                        <BaseInput name="nom d'utilisateur" label="Nom d'utilisateur" rules="required" v-model="user.name"></BaseInput>
                        <BaseInput name="téléphone" label="Téléphone" rules="required" v-model="user.phone"></BaseInput>
                        <BaseInput name="firstname" label="Email" rules="required" v-model="user.email"></BaseInput>
                        <BaseSelect label="Sexe" :items="sexes" v-model="user.sex"></BaseSelect>
                        <BaseSelect label="Rôle" :items="roles" v-model="user.role"></BaseSelect>
                        <BaseButton class="w-[200px]" >Ajouter</BaseButton>
                    </Form>
                    </div>
                   
                </div>
            </div>  
          </div>
  
</template>

<script lang="ts">
import { computed, defineComponent,reactive,ref } from 'vue'
import { useUsersStore } from '../../stores/users'
import { Sex, UserRole } from '../../types/enumerations'
import { Form } from 'vee-validate'

export default defineComponent({
    components:{Form},
    setup () {
        const userStore = useUsersStore()

        const user = reactive({
                name: "",
                phone: "",
                email: "",
                address: "",
                sex: "",
                role: "",
            })

        const sexes = computed(()=>{
            return [{
                title : "Homme",
                value : Sex.MALE
            },
            {
                title : "Femme",
                value : Sex.FEMALE
            },
            {
                title : "Autre",
                value : Sex.OTHERS
            }]
        })

        const roles = computed(()=>{
            return [
                {
                    title : "Administrateur",
                    value : UserRole.ADMIN
                },
                {
                    title : "Livreur",
                    value : UserRole.DELIVERY_MAN
                }
            ]
        })

        const showModal = ref(false)

       
        const titles = [
            {
                title : "Nom d'utilisateur",
                name : "name"
                
            },
            {
                title : "Email",
                name : "email"
            },
            {
                title : "Téléphone",
                name : "phone"
            },
            {
                title : "Rôle",
                name : "role",
                transform : getRoleLabel
            },
            
            {
                title : "Action",
                name : "action"
            }
        ]


        function getRoleLabel(element : any, index : number){
            const labels = [{
                code : UserRole.ADMIN,
                label : "Administrateur"
            },
            {
                code : UserRole.DELIVERY_MAN,
                label : "Livreur"
            }]

            return labels.find((value : any)=>value.code == element.role)?.label
        }


        const loading = ref(false)

        async function onSubmit(){
            loading.value = true

            try{
                const response = await userStore.create(user)
            }
            catch(error : any){}
        }
       

        return {
            userStore,
            titles,
            showModal,
            roles,
            sexes,
            user,
            onSubmit
        }
    }
})
</script>

<style scoped>

</style>