import { EntityManager } from "typeorm";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ShareTag } from "../../../../../../../models/share_tags";

export const GET = async (request: MedusaRequest, response: MedusaResponse) => {
  const { tag, store_id } = request.params;
  const manager: EntityManager = request.scope.resolve("manager");
  const shareTagRepo = manager.getRepository(ShareTag);

  // Fetch lineItems belonging to this tag
  const lineItems = await shareTagRepo.findOne({
    where: {
      tag,
      store_id,
    },
    relations: ["items"],
  });

  return response.send({
    cartTag: lineItems,
  });
};
