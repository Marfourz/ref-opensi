import { defineStore } from 'pinia'
import { IUser } from '@/types/interfaces'
import Api from '../../api'



export const useProductStore = defineStore('productStore',{
  
    actions: {
        

        async fetchOne(id : number){
            try{
                const response = await Api.get(`product/${id}`)
                return response.data
            }
            catch(error){

            }
        },
  
        async fetchAll(query : any){
            try{
                const response = await Api.get('product',{params: query})
                return response.data
            }
            catch(error){
                throw(error)
            }
        },

        async create(data : any){
            try{
                
                const response = await Api.post('product', data)
                return response
            }
            catch(error){
                throw error
            }
        },

        async update(id : number,data : any){
            try{
                const response = await Api.patch(`product/${id}`, data)
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