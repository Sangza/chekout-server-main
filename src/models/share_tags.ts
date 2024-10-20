import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { Store } from "./store";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { LineItem } from "./line_item";

@Entity()
export class ShareTag extends BaseEntity {
  @Index("ShareTagStoreId")
  @Column({ length: 100 })
  store_id: string;

  @Column({ length: 12 })
  tag: string;

  @ManyToOne(() => Store, store => store.cart_tags)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store: Store;

  @OneToMany(() => LineItem, cart => cart.share_tag, { onDelete: "CASCADE" })
  items: LineItem[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "tag");
  }
}
