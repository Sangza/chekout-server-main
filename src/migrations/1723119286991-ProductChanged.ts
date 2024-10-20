import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductChanged1723119286991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "store_id" character varying REFERENCES "store" ON DELETE CASCADE`
    );
    await queryRunner.query(
      `CREATE INDEX "ProductStoreId" ON "product" ("store_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."ProductStoreId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "store_id"`);
  }
}
