import { defineStore } from "pinia";
import type { IOrder, IProduct, ItemsOrder, PrimaryKey } from "../types/interfaces";

export interface IItem {
  product: IProduct;
  quantity: number;
}

export const useBasketStore = defineStore("basket", {
  state: () => ({
    items: [] as Array<IItem>,
  }),

  actions: {
    addToBasket(product: IProduct, quantity: number) {
      const index = this.items.findIndex(
        (item: IItem) => item.product.id == product.id
      );

        if(index != -1)
            this.items.splice(index,1,{product,quantity})
        else
            this.items.push({
                product,
                quantity
            })
       },
       withdrawProduct(id : PrimaryKey){
        this.items = this.items.filter((item : IItem)=>item.product.id != id)
        },

        createBasketWithOrder(order : IOrder){
            
            
            this.clearBasket()
            
            order.items.forEach((value : ItemsOrder)=>{
                this.addToBasket(value.product,value.quantity)
            })

            console.log("order", this.items
            );
        },


        clearBasket(){
            this.items = []
          },
          getProductItem(id : PrimaryKey){
            return this.items.find((item : IItem)=> item.product.id == id)
          },


      },

  getters: {
    getItems: (state) => state.items,
    getTotalProduct: (state) => {
      let total = 0
      state.items.forEach((value : IItem)=>{
        total += total + +value.quantity
      })
      return total
    },
    getBasketPrice: (state) => {
      let price = 0;
      state.items.forEach((item: IItem) => {
        price = price + item.product.bulkPrice * item.quantity;
      });

      return price;
    },
  },
});
