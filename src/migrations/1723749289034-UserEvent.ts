import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class UserEvent1723749289034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "chekout_event",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "user_id",
            type: "varchar",
            length: "100",
          },
          {
            name: "event_type",
            type: "varchar",
            length: "50",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
          },
          {
            name: "phone",
            type: "varchar",
            length: "50",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "chekout_event",
      new TableIndex({
        name: "IDX_UserEventId",
        columnNames: ["user_id"],
      })
    );

    await queryRunner.createForeignKey(
      "chekout_event",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("chekout_event");
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("user_id") !== -1
    );
    await queryRunner.dropForeignKey("chekout_event", foreignKey);
    await queryRunner.dropIndex("chekout_event", "IDX_UserEventId");
    await queryRunner.dropTable("chekout_event");
  }
}
