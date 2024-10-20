import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { loggedInStoreVar } from "../../../../../../middlewares/register-logged-in-user-store";
import { ShareTag } from "../../../../../../models/share_tags";
import { Store } from "../../../../../../models/store";

export default async function HandleGetRequest(
  request: MedusaRequest,
  response: MedusaResponse
) {
  //!! Implement with shareTagService
  // Just get tags and the service returns the tags belonging to the authenticated store

  const manager: EntityManager = request.scope.resolve("manager");
  const authenticatedStore: Store = request.scope.resolve(loggedInStoreVar);
  const shareTagRepo = manager.getRepository(ShareTag);

  const { limit = 15, offset = 0 } = request.query;

  const shareTags = await shareTagRepo
    .createQueryBuilder("tag")
    .select(["tag.id", "tag.tag", "tag.created_at", "tag.updated_at"])
    .leftJoinAndSelect("tag.items", "line_item")
    .where("tag.store_id = :store_id", { store_id: authenticatedStore.id })
    .take(Number(limit))
    .skip(Number(offset))
    .orderBy("tag.created_at", "DESC")
    .getManyAndCount();

  return response.status(200).send({
    tags: shareTags,
  });
}
