import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { User } from "../../../../../models/user";
import { loggedInUserVar } from "../../../../../middlewares/register-logged-in-user";
import { EntityManager } from "typeorm";

export default async function handleGetRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const authenticatedUser: User = req.scope.resolve(loggedInUserVar);
  const manager: EntityManager = req.scope.resolve("manager");
  const userRepo = manager.getRepository(User);

  //   The authenticated user is a user object but there is a possibility it may not track a changed value.. So, although repititive it ensures data integrity
  const loggedInUser = await userRepo.findOne({
    where: {
      id: authenticatedUser.id,
    },
    relations: ["store"],
  });

  //   User is logged in and returns user information
  return res.status(200).send({ success: true, user: loggedInUser });
}
