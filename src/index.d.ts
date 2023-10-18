export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    products?: Product[];
    deposits?: Deposit[];
  }
}
export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    deposits?: Deposit[];
  }
}

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    seller_id?: string;
    user?: User;
  }
}
export declare module "@medusajs/medusa/dist/models/deposit" {
  declare interface Deposit {
    user_id?: string;
    user?: User;
    customer_id?: string;
    customer?: Customer;
  }
}