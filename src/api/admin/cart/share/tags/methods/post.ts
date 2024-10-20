import { EntityManager } from "typeorm";
import {
  LineItemService,
  MedusaRequest,
  MedusaResponse,
  ProductVariant,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import validateShareTag from "../rules";
import generateTag from "../../../../../../utilities/generate";
import { ShareTag } from "../../../../../../models/share_tags";
import { Store } from "../../../../../../models/store";
import { loggedInStoreVar } from "../../../../../../middlewares/register-logged-in-user-store";
import processStoreHandle from "../../../../../../utilities/process-store-handle";

export default async function HandlePostRequest(
  request: MedusaRequest,
  response: MedusaResponse
) {
  // Get list of product ids
  // Get a random variant for this product
  // Generate a share tag identifier and
  // create line item for this product
  // last tag line items to that identifier

  const productDetails = validateShareTag(request.body);

  if (productDetails.ids.length === 0)
    return response.status(400).send({
      type: MedusaError.Types.INVALID_DATA,
      message: "Product ids property cannot be an empty array.",
    });

  const manager: EntityManager = request.scope.resolve("manager");
  const productVariantRepo = manager.getRepository(ProductVariant);
  const authenticatedStore: Store = request.scope.resolve(loggedInStoreVar);
  const shareTagRepo = manager.getRepository(ShareTag);
  const lineItemService: LineItemService =
    request.scope.resolve("lineItemService");

  const randomVariants = await Promise.all(
    productDetails.ids.map(async id => {
      const variant = await productVariantRepo.query(
        `SELECT product.title, outer_temp_table.id, money_amount_id, product_id, amount, thumbnail from product LEFT JOIN (
            SELECT inner_temp_table.id, money_amount_id, product_id, amount 
            FROM money_amount LEFT JOIN (
              SELECT product_variant.id, money_amount_id, product_id FROM 
              product_variant_money_amount 
              LEFT JOIN product_variant ON product_variant_money_amount.variant_id = product_variant.id
            ) AS inner_temp_table ON money_amount.id = inner_temp_table.money_amount_id) AS outer_temp_table
           on outer_temp_table.product_id = product.id
          WHERE outer_temp_table.product_id = '${id}' AND store_id = '${authenticatedStore.id}'
          ORDER BY RANDOM() LIMIT 1`
      );

      return variant;
    })
  );

  console.log(randomVariants, productDetails);

  let foundEmptyItem = false;
  for (let i = 0; i < randomVariants.length; i += 1) {
    if (randomVariants[i].length === 0) {
      foundEmptyItem = true;
      response.status(400).send({
        type: MedusaError.Types.INVALID_DATA,
        message: "A selected product does not belong to this store.",
      });
      break;
    }
  }

  if (foundEmptyItem) return;

  let shareTag = "";
  if (!productDetails.handle) {
    let tagExists = true;
    do {
      shareTag = generateTag();
      tagExists = await shareTagRepo.exist({
        where: { tag: shareTag, store_id: authenticatedStore.id },
      });
    } while (tagExists);
  } else {
    // Check if handle exists already
    const handle = processStoreHandle(productDetails.handle);
    const handleAlreadyExists = await shareTagRepo.exist({
      where: { tag: handle, store_id: authenticatedStore.id },
    });
    if (handleAlreadyExists)
      return response.status(400).send({
        type: MedusaError.Types.DUPLICATE_ERROR,
        message: "You have already created a store tag with this handle.",
      });
    shareTag = handle;
  }

  //* Run in a transaction
  await manager.transaction(async transactionEntityManager => {
    //!! Implement with shareTagService
    // use this in a create method in the shareTagService later (Having problem creating it right now)
    // To test if the transaction works, mimic a small error during the transaction to see if it reverts back (like save the tag value instead of its id to lineItems)
    // *************************************
    if (
      !productDetails.handle &&
      (shareTag.length < 12 || shareTag.length > 13)
    )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "tag should be between 12 and 13 characters long"
      );

    //? Create tag
    const newShareTag = shareTagRepo.create({
      tag: shareTag,
      store_id: authenticatedStore.id,
    });
    await transactionEntityManager.save(newShareTag);
    // *************************************

    const transactionallineItemService = lineItemService.withTransaction(
      transactionEntityManager
    );
    await Promise.all(
      randomVariants.map(async productVariant => {
        const [variant] = productVariant;
        const items = await transactionallineItemService.create({
          share_tag_id: newShareTag.id,
          title: variant.title,
          cart_id: null,
          thumbnail: variant.thumbnail,
          quantity: 1,
          product_id: variant.product_id,
          variant_id: variant.id,
          is_discountable: false,
          is_tax_inclusive: false,
          requires_shipping: true,
          unit_price: variant.amount,
        });

        return items;
      })
    );
  });

  // Get tag and return it

  const newlyCreatedTag = await shareTagRepo.findOne({
    where: { tag: shareTag, store_id: authenticatedStore.id },
    relations: ["items"],
  });
  return response.status(201).send({
    label: shareTag,
    tag: newlyCreatedTag,
  });
}
