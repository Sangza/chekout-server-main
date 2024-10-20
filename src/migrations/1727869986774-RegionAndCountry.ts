import { MigrationInterface, QueryRunner } from "typeorm";

export class RegionAndCountry1727869986774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "region_countries" (
            "regionId" character varying NOT NULL,
            "countryId" integer NOT NULL,
            CONSTRAINT "PK_region_countries" PRIMARY KEY ("regionId", "countryId"),
            CONSTRAINT "UQ_region_country" UNIQUE ("regionId", "countryId")
        )
    `);

    await queryRunner.query(`
        ALTER TABLE "region_countries"
        ADD CONSTRAINT "FK_region_country"
        FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
        ALTER TABLE "region_countries"
        ADD CONSTRAINT "FK_country_region"
        FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "region_countries"`);
  }
}
