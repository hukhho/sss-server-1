export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    products?: Product[];
  }
}

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    seller_id?: string;
    user?: User;
  }
}