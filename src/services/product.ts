import { Lifetime } from "awilix";
import {
  ProductService as MedusaProductService,
  Product,
  Store,
} from "@medusajs/medusa";
import {
  CreateProductInput as MedusaCreateProductInput,
  FindProductConfig,
  ProductSelector as MedusaProductSelector,
} from "@medusajs/medusa/dist/types/product";
import { MedusaError } from "@medusajs/utils";
import { loggedInStoreVar } from "../middlewares/register-logged-in-user-store";

type ProductSelector = {
  store_id: string;
} & MedusaProductSelector;

type CreateProductInput = {
  store_id: string;
} & MedusaCreateProductInput;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly _loggedInUserStore: Store | null;

  constructor(container: any) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this._loggedInUserStore = container[loggedInStoreVar];
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<Product[]> {
    if (!selector.store_id && this._loggedInUserStore) {
      selector.store_id = this._loggedInUserStore.id;
    }

    config.select?.push("store_id");
    config.relations?.push("store");
    return await super.list(selector, config);
  }

  async listAndCount(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    if (!selector.store_id && this._loggedInUserStore) {
      selector.store_id = this._loggedInUserStore.id;
    } else {
      // Check query for store id, which means we should expect a store_id
      // If id of product(s) is passed, then ignore the store_id.. Remeber multiple products from different stores can show up in cart irrespective of the store they are in
      const product_id = selector.hasOwnProperty("id");

      if (!product_id) {
        const { q } = selector;
        let store_id = "";
      
        if (q) {
          // Split the `q` parameter and look for the store ID
          const queries = q.split("|").filter(query => {
            // Check if the query starts with "chekout_store_"
            if (query.startsWith("chekout_store_")) {
              store_id = query.split("chekout_")[1]; // Extract store_id
            } else {
              return true; // Keep other parts of the query
            }
          });
      
          // Only assign the `store_id` if it was found
          if (store_id) {
            selector.store_id = store_id;
          }
      
          // Remove the `chekout_store_` part from `q`
          selector.q = queries.join("|");
        }
      }
    }

    // config.select?.push("store_id"); // Already added in the loaders
    config.relations?.push("store");
    return await super.listAndCount(selector, config);
  }

  async listWithStoreId(store_id: string, filter = {}, config = {}) {
    //* Extend the base list logic to include the store_id filter
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    );

    //* Add store_id to the filter conditions
    const queryOptions = {
      where: {
        // store_id: ILike(`%${store_id}%`)
        store_id, // or exact match if store_id is an exact string
        ...filter,
      },
      ...config,
    };

    return productRepo.find(queryOptions);
  }

  async retrieve(
    productId: string,
    config?: FindProductConfig
  ): Promise<Product> {
    config.relations = [...(config.relations || []), "store"];

    const product = await super.retrieve(productId, config);

    if (
      product.store.id &&
      this._loggedInUserStore &&
      product.store.id !== this._loggedInUserStore.id
    ) {
      // This product does not belong to this store, throw an error
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Selected product does not exist for this store."
      );
    }

    return product;
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    if (!productObject.store_id && this._loggedInUserStore.id) {
      productObject.store_id = this._loggedInUserStore.id;
    }

    return await super.create(productObject);
  }
}

export default ProductService;
