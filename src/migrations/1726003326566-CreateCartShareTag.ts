import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateCartShareTag1726003326566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Cart Share Tag Table
    await queryRunner.createTable(
      new Table({
        name: "share_tag",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
          },
          {
            name: "tag",
            type: "varchar",
            length: "12",
          },
          {
            name: "store_id",
            type: "varchar",
            length: "100",
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
      }),
      true
    );

    // Create column for line_item table
    await queryRunner.addColumn(
      "line_item",
      new TableColumn({
        name: "share_tag_id",
        type: "varchar",
        length: "200",
        isNullable: true,
      })
    );

    // Create foreign key for cart_id
    await queryRunner.createForeignKey(
      "line_item",
      new TableForeignKey({
        columnNames: ["share_tag_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "share_tag",
        onDelete: "CASCADE",
      })
    );

    // Create foreign key for store_id
    await queryRunner.createForeignKey(
      "share_tag",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "store",
      })
    );

    // Create index for share_tag_id
    await queryRunner.createIndex(
      "line_item",
      new TableIndex({
        name: "ShareTagLineItemId",
        columnNames: ["share_tag_id"],
      })
    );

    // Create index for store_id
    await queryRunner.createIndex(
      "share_tag",
      new TableIndex({
        name: "ShareTagStoreId",
        columnNames: ["store_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const table = await queryRunner.getTable("share_tag");
    const lineItem = await queryRunner.getTable("line_item");

    const storeForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf("store_id") !== -1
    );
    const shareTagForeignKey = lineItem.foreignKeys.find(
      fk => fk.columnNames.indexOf("share_tag_id") !== -1
    );

    if (storeForeignKey)
      await queryRunner.dropForeignKey("share_tag", storeForeignKey);
    if (shareTagForeignKey)
      await queryRunner.dropForeignKey("line_item", shareTagForeignKey);

    // Drop indices
    await queryRunner.dropIndex("line_item", "ShareTagLineItemId");
    await queryRunner.dropIndex("share_tag", "ShareTagStoreId");

    // Drop line_item column
    await queryRunner.dropColumn("line_item", "share_tag_id");

    // Drop table
    await queryRunner.dropTable("share_tag");
  }
}
