import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class EditProductVariantMoneyAmountTable1725102661155
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign key (One to One relationship) for money_amount_id
    await queryRunner.createForeignKey(
      "product_variant_money_amount",
      new TableForeignKey({
        columnNames: ["money_amount_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "money_amount",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key for variant_id
    await queryRunner.createForeignKey(
      "product_variant_money_amount",
      new TableForeignKey({
        columnNames: ["variant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_variant",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the unique constraint from money_amount_id
    await queryRunner.dropUniqueConstraint(
      "product_variant_money_amount",
      "UQ_product_variant_money_amount_money_amount_id"
    );

    // Remove foreign key for money_amount_id
    await queryRunner.dropForeignKey(
      "product_variant_money_amount",
      "FK_product_variant_money_amount_money_amount_id"
    );

    // Remove foreign key for variant_id
    await queryRunner.dropForeignKey(
      "product_variant_money_amount",
      "FK_product_variant_money_amount_variant_id"
    );
  }
}
