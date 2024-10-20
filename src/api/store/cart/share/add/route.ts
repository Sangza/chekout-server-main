import {
  LineItem,
  LineItemService,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";
import validateAddFromTag from "./rules";
import { EntityManager } from "typeorm";

export const POST = async (
  request: MedusaRequest,
  response: MedusaResponse
) => {
  const manager: EntityManager = request.scope.resolve("manager");
  const validatedData = validateAddFromTag(request.body);
  const lineItemService: LineItemService =
    request.scope.resolve("lineItemService");

  const { cart_id, items } = validatedData;

  // Fetch line_item, add again with the cart_id
  // In a transaction
  await manager.transaction(async transactionEntityManager => {
    const transactionallineItemService = lineItemService.withTransaction(
      transactionEntityManager
    );
    const transactionallineItemServiceRepo =
      transactionEntityManager.getRepository(LineItem);
    await Promise.all(
      items.map(async (lineItem: LineItem) => {
        const exists = await transactionallineItemServiceRepo.exist({
          where: { cart_id: cart_id, variant_id: lineItem.variant_id },
        });

        if (exists) {
          transactionallineItemServiceRepo.increment(
            { variant_id: lineItem.variant_id, cart_id: cart_id },
            "quantity",
            1
          );
        } else {
          delete lineItem["id"];
          delete lineItem["share_tag_id"];
          delete lineItem["created_at"];
          delete lineItem["updated_at"];
          await transactionallineItemService.create({ ...lineItem, cart_id });
        }
      })
    );
  });

  return response.status(201).send({
    message: "Added to cart successfully.",
  });
};
