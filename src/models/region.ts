import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Country, Region as MedusaRegion } from "@medusajs/medusa";

@Entity()
export class Region extends MedusaRegion {
  @ManyToMany(() => Country)
  @JoinTable({ name: "region_countries" })
  region_countries: Country[];
}
