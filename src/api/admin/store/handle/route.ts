import { z } from "zod";
import { MedusaRequest, MedusaResponse, Store } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import { EntityManager } from "typeorm";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const isValidated = z
    .object({
      handle: z.string().min(3),
    })
    .safeParse(req.body);

  if (isValidated.success === false) {
    return res.status(400).send({
      type: MedusaError.Types.INVALID_DATA,
      message:
        "Please ensure that the 'handle' property is a string with minimum of 3 character.",
    });
  }

  const manager: EntityManager = req.scope.resolve("manager");
  const storeRepo = manager.getRepository(Store);

  // Ensure that this handle does not exist before
  const handleAlreadyUsed = await storeRepo.exist({
    where: { handle: isValidated.data.handle },
  });

  if (handleAlreadyUsed)
    return res.status(400).send({
      type: MedusaError.Types.DUPLICATE_ERROR,
      message: "This handle has already been used by someone else.",
    });

  return res.status(200).send({ message: "validated" });
};
