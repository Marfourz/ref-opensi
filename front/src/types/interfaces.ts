import type { OrderStatus, OrganisationType, PackagingType, Sex, UserRole } from "./enumerations";

export type PrimaryKey = string | null | undefined;

export interface Commun {
  id?: PrimaryKey;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct extends Commun{
    name : string,
    category? : IProductCategory,
    categoryId : string,
    unitPrice : number,
    packagingType:PackagingType,
    bulkPrice : number,
    volume : number,
    image? : Array<string>,
    stocks?: Array<any>
} 

export interface IOrganisation extends Commun{
    type: OrganisationType,
    socialReason: string,
    fiscalId: string,
    phone: string,
    email: string,
    adress: string,
    ownerName: string,
    paymentDeadline: 0,
    status?: string
}

export interface IProduct extends Commun {
  name: string;
  category?: IProductCategory;
  unitPrice: number;
  rackPrice: number;
  packPrice: number;
  volume: number;
  image?: Array<string>;
}

export interface IOrganisation extends Commun {}

export interface ItemsOrder extends Commun {
  product: IProduct;
  quantity: number;
  price: number;
  order?: IOrder;
}

export interface IOrder extends Commun {
  organisation?: IOrganisation;
  items: Array<ItemsOrder>;
  totalAmount: number;
  transaction: ITransaction;
  status: OrderStatus;
  deliveryDate: Date;
}

export interface IUser extends Commun {
  name: string;
  phone: string;
  email: string;
  sex: Sex;
  role: UserRole;
  organisationId: string;
  birthday?:Date,
  engineId?:PrimaryKey
}



export interface ITransaction extends Commun {}

export enum FileType {
  PUBLICATION = "PUBLICATION",
  DOCUMENT = "DOCUMENT",
}
