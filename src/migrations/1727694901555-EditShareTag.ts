import { MigrationInterface, QueryRunner } from "typeorm";

export class EditShareTag1727694901555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "share_tag"
            ALTER COLUMN tag
            TYPE character varying(100)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "share_tag"
            ALTER COLUMN tag
            TYPE character varying(12)
        `);
  }
}
