import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreAndOrder1723191713602 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "store_id" character varying REFERENCES "store" ON DELETE SET NULL`
    );
    queryRunner.query(
      `ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "order_parent_id" character varying`
    );
    queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_8a96dde86e3cad9d2fcc6cb171f87" FOREIGN KEY ("order_parent_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE "order" DROP COLUMN "store_id"`);
    queryRunner.query(`ALTER TABLE "order" DROP COLUMN "order_parent_id"`);
    queryRunner.query(
      `ALTER TABLE "order" DROP FOREIGN KEY "FK_8a96dde86e3cad9d2fcc6cb171f87cb2"`
    );
  }
}
