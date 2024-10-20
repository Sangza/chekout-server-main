import { EntityManager } from "typeorm";
import {
  EventBusService,
  MedusaRequest,
  MedusaResponse,
  AdminPostStoreReq,
  validator,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import validateStore from "../rules";
import { Store } from "../../../../models/store";
import { User } from "../../../../models/user";
import { loggedInUserVar } from "../../../../middlewares/register-logged-in-user";
import CloudinaryFileService from "../../../../services/cloudinary-file";
import CUSTOM_EVENTS from "../../../../custom.event";
import processStoreHandle from "../../../../utilities/process-store-handle";
import StoreService from "../../../../services/store";

export default async function HandlePostRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { update = false } = req.body as any;

  if (!update) {
    const storeDetails = validateStore(req.body);

    // Ensure phone number matches with user's phone number
    const manager: EntityManager = req.scope.resolve("manager");
    const storeRepo = manager.getRepository(Store);
    const eventBusService: EventBusService =
      req.scope.resolve("eventBusService");
    const authenticatedUser: User = req.scope.resolve(loggedInUserVar);
    const fileService = new CloudinaryFileService({});

    //* Ensure that owner does not already own a store
    const ownsStore = await storeRepo.exist({
      where: { user_id: authenticatedUser.id },
    });

    if (!authenticatedUser.phone)
      return res.status(400).send({
        type: MedusaError.Types.NOT_ALLOWED,
        message:
          "Please verify your phone number. Phone number required to create your store.",
      });

    if (ownsStore)
      return res.status(400).send({
        type: MedusaError.Types.CONFLICT,
        message: "This user already owns a store, cannot create another.",
      });

    const { store_name, description, handle } = storeDetails;
    let thumbnail = null;
    let thumbnail_key = null;

    //* Handling File Upload
    try {
      if (req.file) {
        const store_thumbnail_data = await fileService.upload(req.file);
        thumbnail = store_thumbnail_data.url;
        thumbnail_key = store_thumbnail_data.key;
      }
    } catch (err) {
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, err.message);
    }

    // create new store in database
    const newStore = storeRepo.create({
      name: store_name,
      user_id: authenticatedUser.id,
      description,
      thumbnail,
      thumbnail_key,
      handle: processStoreHandle(handle),
    });

    await storeRepo.save(newStore);

    res.status(201).send({
      message: "Store created sucessfully.",
      store: newStore,
    });

    // Send out a store created event..
    eventBusService.emit(CUSTOM_EVENTS.store.created, {
      id: authenticatedUser.id,
    });
  } else {
    delete req.body["update"];
    const validatedBody = await validator(AdminPostStoreReq, req.body);

    const storeService: StoreService = req.scope.resolve("storeService");
    const manager: EntityManager = req.scope.resolve("manager");
    const store = await manager.transaction(async transactionManager => {
      return await storeService
        .withTransaction(transactionManager)
        .update(validatedBody);
    });

    res.status(200).json({ store });
  }
}
