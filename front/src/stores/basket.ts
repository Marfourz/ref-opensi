import { defineStore } from "pinia";
import type { IProduct, PrimaryKey } from "../types/interfaces";

export interface IItem {
    product : IProduct,
    quantity : number
}

export const useBasketStore = defineStore('basket', {
    state : () =>({
        items : [] as Array<IItem>
    }),

    actions: {
       addToBasket(product: IProduct,quantity : number){
        this.items.push({
            product,
            quantity
        })
       },
       withdrawProduct(id : PrimaryKey){
        this.items = this.items.filter((item : IItem)=>item.product.id != id)
        },
        clearBasket(){
            this.items = []
          }
      },

      getters: {
        getItems: (state) => state.items,
        getBasketPrice: (state)=>{
            let price = 0
            state.items.forEach((item : IItem)=> {
                price = price + (item.product.packPrice * item.quantity)
            })
           
            return price
      }
    }
     
})

