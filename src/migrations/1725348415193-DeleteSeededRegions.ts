import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteSeededRegions1725348415193 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE country SET region_id = null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        update country set region_id = 'reg_01J4KPT47HX9SMRM351Y1J4WMX' where display_name in ('Canada', 'United States')`);
    await queryRunner.query(`
        update country set region_id = 'reg_01J4KPT43X4V81KT94SS7A5N8Z' where display_name in 
        ('United Kingdom', 'Germany', 'Denmark', 'Sweden', 'France', 'Spain', 'Italy')
    `);
  }
}
