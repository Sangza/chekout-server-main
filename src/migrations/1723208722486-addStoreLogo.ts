import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreLogo1723208722486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE store ADD COLUMN thumbnail text, ADD COLUMN thumbnail_key varchar(200)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE store DROP COLUMN thumbnail, DROP COLUMN thumbnail_key`
    );
  }
}
