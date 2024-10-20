import { authentication_type, user_roles } from "../models/user";
import { MigrationInterface, QueryRunner } from "typeorm";

const custom_type_auth = "auth_type";

export class UserCreate1723013618715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE ${custom_type_auth} 
        AS ENUM (
            '${authentication_type.google}',
            '${authentication_type.password}'
        )`
    );
    await queryRunner.query(
      `ALTER TYPE user_role_enum ADD VALUE '${user_roles.vendor}' AFTER '${user_roles.member}'`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN email_verified boolean DEFAULT false, ADD COLUMN phone varchar(50), ADD COLUMN auth_type ${custom_type_auth}`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN email_verified, DROP COLUMN phone, DROP COLUMN auth_type`
    );
    await queryRunner.query(`DROP TYPE ${custom_type_auth} CASCADE`);
  }
}
