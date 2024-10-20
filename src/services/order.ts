import { OrderService as MedusaOrderService, Store } from "@medusajs/medusa";
import { Lifetime } from "awilix";

class OrderService extends MedusaOrderService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly _loggedInUserStore: Store | null;

  constructor(container: any) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this._loggedInUserStore = container.loggedInStore;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  //   async
}

export default OrderService;
