import { EntityManager } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ShareTag } from "../../../../../../../../models/share_tags";

export default async function HandleGetRequest(
  request: MedusaRequest,
  response: MedusaResponse
) {
  const { store_id, tag } = request.params;

  const manager: EntityManager = request.scope.resolve("manager");
  const shareTagRepo = manager.getRepository(ShareTag);

  const isVerified = await shareTagRepo.exist({
    where: { store_id, tag },
  });

  if (!isVerified)
    return response.status(404).send({
      type: MedusaError.Types.NOT_FOUND,
      message: "Cart Tag does not belong to this store.",
    });

  return response.send({ message: "valid." });
}
