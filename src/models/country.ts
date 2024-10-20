import { Entity, ManyToOne, Unique } from "typeorm";
import { Country as MedusaCountry } from "@medusajs/medusa";
import { Region } from "./region";

@Entity()
export class Country extends MedusaCountry {
  @ManyToOne(() => Region)
  region: Region;
}
