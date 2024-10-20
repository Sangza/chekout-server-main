import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Store as MedusaStore } from "@medusajs/medusa";
import { User } from "./user";
import { Product } from "./product";
import { Order } from "./order";
import { ShareTag } from "./share_tags";

@Entity()
export class Store extends MedusaStore {
  @Index("UserStoreId")
  @Column()
  user_id: string;

  @Column()
  description: string;

  @Column()
  handle: string;

  @Column()
  thumbnail: string;

  @Column()
  thumbnail_key: string;

  @OneToOne(() => User, user => user?.store, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  owner: User;

  @OneToMany(() => Product, product => product.store)
  products: Product[];

  @OneToMany(() => Order, order => order.store)
  orders: Order[];

  @OneToMany(() => ShareTag, tag => tag.store, { onDelete: "CASCADE" })
  cart_tags: ShareTag[];
}
