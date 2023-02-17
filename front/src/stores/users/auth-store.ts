import { defineStore } from 'pinia'
import Api from '@/api'
import { useUserStore } from '.'


export const useAuthStore = defineStore('authStore',{
    actions: {
        async login(data : {username :string, password : string}){
            try{
                const response = await Api.post('auth/login',data)
                if(response.data.access_token && Api.setToken)
                    Api.setToken(response.data.access_token)
              
                useUserStore().saveCurrentUser(response.data.user)
            }
            catch(error){
                throw error
            }
        }
    }
})