import { EntityManager, ILike } from "typeorm";
import { MedusaRequest, MedusaResponse, Store } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";

export default async function HandleGetRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { store_handle } = req.params;
  const manager: EntityManager = req.scope.resolve("manager");
  const storeRepo = manager.getRepository(Store);

  const currentStore = await storeRepo.findOneBy({
    handle: store_handle.toLowerCase(),
  });

  if (!currentStore)
    return res.status(404).send({
      type: MedusaError.Types.NOT_FOUND,
      message:
        "Could not find any info about your requested store, please ensure store details are correct and try again",
    });

  return res.status(200).send({
    store: currentStore,
  });
}
