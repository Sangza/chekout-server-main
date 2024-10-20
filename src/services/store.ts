import { Lifetime } from "awilix";
import {
  FindConfig,
  StoreService as MedusaStoreService,
  Store,
  User,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import { userNotAVendor } from "../errors/messages";
import { loggedInUserVar } from "../middlewares/register-logged-in-user";

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly _loggedInUser: User | null;

  constructor(container: any) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    // using the registered resource "loggedInUser"
    try {
      this._loggedInUser = container[loggedInUserVar];
    } catch (e) {
      // avoid errors when the backend first loads
    }
  }

  async retrieve(config?: FindConfig<Store>): Promise<Store> {
    if (!this._loggedInUser) return super.retrieve(config); // Will throw an authorised before even reaching here because of the authenticate middleware,
    return this.retrieveForLoggedInUser(config);
  }

  async retrieveForLoggedInUser(config?: FindConfig<Store>) {
    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    const store = await storeRepo.findOne({
      ...config,
      relations: [...config.relations, "owner"],
      where: {
        user_id: this._loggedInUser.id,
      },
    });

    if (!store) {
      // Chekout error - Database Error (or just return an empty object)
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        userNotAVendor.message
      );
    }

    return store;
  }
}

export default StoreService;
