import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkStoreAndUser1723059067607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" ADD "user_id" character varying UNIQUE REFERENCES "user" ON DELETE CASCADE`
    );
    await queryRunner.query(
      `CREATE INDEX "UserStoreId" ON "store" ("user_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UserStoreId"`);
    await queryRunner.query(`ALTER TABLE store DROP COLUMN "user_id"`);
  }
}
