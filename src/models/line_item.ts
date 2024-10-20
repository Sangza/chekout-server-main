import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { LineItem as MedusaLineItem } from "@medusajs/medusa";
import { ShareTag } from "./share_tags";

@Entity()
export class LineItem extends MedusaLineItem {
  @Index("ShareTagLineItemId")

  // Any one with this column not null does not belong to a cart
  @Column()
  share_tag_id: string;

  @ManyToOne(() => ShareTag, share_tag => share_tag.items)
  @JoinColumn({ name: "share_tag_id", referencedColumnName: "id" })
  share_tag: ShareTag;
}
