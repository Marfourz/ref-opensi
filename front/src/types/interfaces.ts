import { IItem } from "../stores/basket";
import type {
  OrderStatus,
  OrganisationType,
  PackagingType,
  Sex,
  UserAccountStatus,
  UserRole,
} from "./enumerations";

export type PrimaryKey = string | null | undefined;

export interface Commun {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductCategory extends Commun {
  name: string;
  description: string;
}

export interface IProduct extends Commun {
  name: string;
  category?: IProductCategory;
  categoryId: string;
  unitPrice: number;
  packagingType: PackagingType;
  bulkPrice: number;
  volume: number;
  image?: Array<string>;
  stocks?: Array<any>;
}

export interface IOrganisation extends Commun {
  name: string;
  type: OrganisationType;
  socialReason: string;
  fiscalId: string;
  phone: string;
  email: string;
  adress: string;
  ownerName: string;
  paymentDeadline: 0;
  status?: string;
  orders?: Array<ItemsOrder>;
  wallet: Wallet;
  parentOrganisationId?:string
}
export interface Wallet extends Commun {
  turnover: string;
}

//TODO productsInfos type
export interface InfoOrganisation {
  organisation: IOrganisation;
  orders: Array<ItemsOrder>;
  partners: string;
  productsInfos:Record<any,any>
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
  organisation: IOrganisation;
  organisationId: string;
  birthday?: Date;
  engineId?: PrimaryKey;
  status?: UserAccountStatus;
  address?: string;
}

export interface ITransaction extends Commun {}

export enum FileType {
  PUBLICATION = "PUBLICATION",
  DOCUMENT = "DOCUMENT",
}
export interface IAction {
  title: string;
  icon: string;
  titleClass?: string;
  iconClass?: string;
  action: Function;
}