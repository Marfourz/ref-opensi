import type { OrderStatus, Sex, UserRole } from "./enumerations";

export type PrimaryKey = string | null | undefined;



export interface Commun {
    id?: PrimaryKey;
    createdAt?: Date;
    updatedAt?: Date;
  }


export interface IProductCategory extends Commun{
    name : string,
    description : string
}

export interface IProduct extends Commun{
    name : string,
    category? : IProductCategory,
    unitPrice : number,
    rackPrice : number,
    packPrice : number,
    volume : number,
    image? : Array<string>
} 

export interface IOrganisation extends Commun{

}

export interface ItemsOrder extends Commun{
    product : IProduct,
    quantity : number,
    price : number,
    order? : IOrder
}


export interface IOrder extends Commun{
    organisation? : IOrganisation,
    items : Array<ItemsOrder>,
    totalAmount : number,
    transaction : ITransaction,
    status : OrderStatus,
    deliveryDate : Date


}

export interface IUser extends Commun {
    name : string,
    phone : string,
    email : string,
    sex : Sex,
    role : UserRole

}


export interface ITransaction extends Commun{

}

