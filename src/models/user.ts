// Extending medusa core user model

import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { User as MedusaUser } from "@medusajs/medusa";
import checkColumn from "../utilities/check-column";
import { Store } from "./store";
import { ChekoutEvent } from "./chekout_event";
import { UserRoles } from "@medusajs/medusa/dist/models";

export const user_roles = {
  member: "member",
  vendor: "vendor",
  admin: "admin",
  developer: "developer",
};

export const authentication_type = {
  google: "google",
  password: "password",
};

@Entity()
export class User extends MedusaUser {
  // TODO add relations

  @Column({ length: 50 })
  phone: string | null;

  @Column()
  email_verified: boolean;

  @Column({ length: 20 })
  auth_type: string;

  @Column()
  creating_store: boolean;

  @OneToOne(() => Store, store => store.owner)
  store?: Store;

  @OneToMany(() => ChekoutEvent, event => event.user)
  events: ChekoutEvent[];

  @BeforeInsert()
  private checkUserRole(): void {
    checkColumn(this.id, user_roles);
  }

  @BeforeInsert()
  private checkAuthTye(): void {
    checkColumn(this.auth_type, authentication_type);
  }
}

export const userRelations = ["store"];
