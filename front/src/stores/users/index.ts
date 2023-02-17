import { defineStore } from 'pinia'
import { IUser } from '@/types/interfaces'
import Api from '../../api'
import { UserRole } from '../../types/enumerations'
import users from '../../data/users'


export const useUsersStore = defineStore('usersStore',{
  
    actions: {
        getRoleLabel(role : UserRole) : string | undefined{
            const labels = [{
                code : UserRole.ADMIN,
                label : "Administrateur"
            },
            {
                code : UserRole.DELIVERY_MAN,
                label : "lIVREUR"
            }]

            return labels.find((value : any)=>value.code == role)?.label
        },


        async me(){
            try{
                const response = await Api.get(`users/me`)
                console.log('me response', response)
                return response.data
            }
            catch(error){

            }
        },


        saveCurrentUser(user : IUser){
            localStorage.setItem('current_user', JSON.stringify(user))
        },

        async findOne(id : number){
            try{
                const response = await Api.get(`users/${id}`)
                return response.data
            }
            catch(error){

            }
        },
  
        async fetchAll(query : any){
           
            try{
                const response = await Api.get('users')
                return response.data
            }
            catch(error){
                throw(error)
            }
        },

        async findByEmail(email : string){
            try{
                const response = await Api.get(`users/search/email/${email}`)
                return response.data
            }
            catch(error){
                throw(error)
            }
        },

        async sendResetPasswordCode(email : string){
            try{
                const response = await Api.post(`auth/password/forgot`,{email:email})
                return response.data
            }
            catch(error){
                throw(error)
            }
        },

        async verifyResetPasswordCode(email : string, code : number){
            try{
                const response = await Api.post(`auth/password/verify-code`,{email, code})
                return response.data
            }
            catch(error){
                throw(error)
            }
        },

        async resetPassword(data : {email : string, code : number, password : string}){
            console.log("ssss",data);
            
            try{
                const response = await Api.post(`auth/password/reset`, data)
            }
            catch(error){
                throw(error)
            }

        },

        async definePassword(data : {token : string, password : string}){
            console.log("ssss",data);
            
            try{
                const response = await Api.post(`auth/password/define`, data)
            }
            catch(error){
                throw(error)
            }

        },


        


        async create(data : any){
            try{
                
                const response = await Api.post('users', {...data,organisationId :this.getCurrentUser?.id })
                return response
            }
            catch(error){
                throw error
            }
        },

        async update(id : number,data : any){
            try{
                const response = await Api.patch(`users/${id}`, data)
                return response
            }
            catch(error){
                throw error
            }
        },


        async delete(id : number){
            try{
                const response = await Api.delete(`users/${id}`)
                return response
            }
            catch(error){
                throw error
            }
        }
    },

    getters: {


        



        getCurrentUser() : IUser | null{
            const user = localStorage.getItem('current_user')
            console.log("user", user);
            
            if(user)
                return JSON.parse(user)
            return null
        },
        
    }
})