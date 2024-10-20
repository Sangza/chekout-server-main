import { Lifetime } from "awilix";
import {
  Cart,
  FindConfig,
  CartService as MedusaCartService,
} from "@medusajs/medusa";

class CartService extends MedusaCartService {
  static LIFE_TIME = Lifetime.SCOPED;

  async retrieve(
    cartId: string,
    options?: FindConfig<Cart>,
    totalsConfig?: { force_taxes?: boolean }
  ): Promise<Cart> {
    options.relations = [
      ...(options.relations ? options.relations : []),
      "items",
      "shipping_address",
      "sales_channel",
      "region",
      "gift_cards",
      "items.variant",
      "items.variant.product.store",
    ];

    const cart = await super.retrieve(cartId, options, totalsConfig);
    return cart;
  }
}

export default CartService;
