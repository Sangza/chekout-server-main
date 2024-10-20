import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Order as MedusaOrder } from "@medusajs/medusa";
import { Store } from "./store";

@Entity()
export class Order extends MedusaOrder {
  @Index()
  @Column({ nullable: true })
  //   A parent order will not have a store_id
  store_id: string;

  @Index()
  @Column({ nullable: true })
  //   A parent order will not have an order_parent_id
  order_parent_id: string;

  @ManyToOne(() => Store, store => store.orders)
  @JoinColumn({ name: "store_id" })
  //   A child order is linked to a store
  store: Store;

  @ManyToOne(() => Order, order => order.children)
  @JoinColumn({ name: "order_parent_id" })
  parent: Order;

  @OneToMany(() => Order, order => order.parent)
  @JoinColumn({ name: "id", referencedColumnName: "order_parent_id" })
  children: Order[];
}
