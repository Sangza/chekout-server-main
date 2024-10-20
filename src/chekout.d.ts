import { UserRolesExtended } from "./models/user";

//* Extended user entity
export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    auth_type: string;
    phone: string | null;
    email_verified: boolean;
    store?: Store;
    creating_store: boolean;
  }
}

//* Extended store entity
export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    user_id: string;
    owner: User;
    thumbnail: string;
    thumbnail_key: string;
    description: string;
    products: Product[];
    orders: Order[];
    handle: string;
  }
}

//* Extended product entity
export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    store_id: string;
    store: Store;
  }
}

//* Extended order entity
export declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    store_id: string | null;
    store: Store | null;
    order_parent_id: string | null;
    parent: Order | null;
    children: Order[] | null;
  }
}

//* Extended region entity
export declare module "@medusajs/medusa/dist/models/region" {
  declare interface Region {
    region_countries: Country[];
  }
}

//* Extended order entity
export declare module "@medusajs/medusa/dist/types/region" {
  declare interface CreateRegionInput {
    region_countries: Country[];
  }
}
