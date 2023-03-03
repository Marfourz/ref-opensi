import { defineStore } from 'pinia'
import Api from '@/api'
import { useUsersStore } from '.'


export const useAuthStore = defineStore('authStore',{
    actions: {
        async login(data : {username :string, password : string}){
            try{
                const response = await Api.post('auth/login',data)
                console.log('user', response.data)
                if(response.data.token && Api.setToken){
                    Api.setToken(response.data.token)
                    console.log("change token", response.data.token);
                    
                }
                    
                useUsersStore().saveCurrentUser(response.data.user)
            }
            catch(error){
                throw error
            }
        },


        async logout(){
            try{
                useUsersStore().saveCurrentUser(null)
                if(Api.setToken)
                    Api.setToken("")
                
            }
            catch(error){
                throw error
            }
        }


    }
})