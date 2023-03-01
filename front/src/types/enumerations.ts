export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
    OTHERS = 'others'
  }
  
  export enum UserRole {
    SUPER_USER = 'superUser',
    ADMIN = 'administrator',
    ACCOUNTANT =  'accountant',
    COMMERCIAL = 'commercial',
    
   
    DELIVERY_MAN = 'deliveryMan'
  }
  
  export enum UserPermission {
    ADMINSTRATOR = 'administra tor',
    DELIVERY_MAN = 'deliveryMan'
  }
  
  export enum OrganisationType {
    SNB = 'snb',
    DA = 'da',
    MD = 'md'
  }
  
  export enum OrderStatus {
    DELIVERY = 'delivered',
    PENDING = 'pending',
    REJECTED = 'rejected'
  }

  export enum AccountStatus {
    DELIVERY = 'delivered',
    PENDING = 'pending',
    REJECTED = 'rejected'
  }
  
  export enum TransactionStatus {
    SUCCESS = 'success',
    PENDING = 'pending'
  }
  
  export enum PaymentMethod {
    KKIAPAY = 'kkiapay',
    CASH = 'cash'
  }
  
  export enum InvoiceStatus {
    PAID = 'paid',
    UNPAID = 'unpaid'
  }


  export enum PackagingType {
    RACK = 'rack',
    PACK = 'pack'
  }


  export enum UserAccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = "suspended",
  }


  export enum OrderStatus {
    NEW = 'new',
    DELIVERED = 'delivered',
    ACCEPTED = 'accepted'
  }
