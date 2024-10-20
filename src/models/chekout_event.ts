import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user";

export const chekoutEvents = {
  update_phone: "Phone_number_update",
  order_placed: "Order_placed",
};

@Entity()
export class ChekoutEvent extends BaseEntity {
  @Index("UserEventId")
  @Column({ length: 100 })
  user_id: string;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column({ length: 50 })
  event_type: string;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 50 })
  phone: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "evnt");
  }
}
