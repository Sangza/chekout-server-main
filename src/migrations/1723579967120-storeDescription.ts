import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreDescription1723579967120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" ADD COLUMN description varchar(300), ADD COLUMN handle varchar(200) UNIQUE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" DROP COLUMN description, DROP COLUMN handle`
    );
  }
}
