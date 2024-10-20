import { Lifetime } from "awilix";
import { ProductVariantService as MedusaProductVariantService } from "@medusajs/medusa";

class ProductVariantService extends MedusaProductVariantService {
  static LIFE_TIME = Lifetime.SCOPED;
}

export default ProductVariantService;
