import { SubscriberConfig, SubscriberArgs } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { User, user_roles } from "../models/user";
import CUSTOM_EVENTS from "../custom.event";

export default async function handleStoreCreated({
  data,
  container,
}: SubscriberArgs) {
  const manager: EntityManager = container.resolve("manager");
  const userRepo = manager.getRepository(User);

  // Update user role from member to vendor
  const { id } = data as any;
  const user = await userRepo.findOne({ where: { id } });

  // Update the user role
  user.role = user_roles.vendor as any; // Not registered in base enum but part of the db type
  await userRepo.save(user);

  //* Add Message welcoming new vendor
  console.log(`Store created for: `, id);
}

export const config: SubscriberConfig = {
  event: CUSTOM_EVENTS.store.created,
  context: {
    subscriberId: "store-created-handler",
  },
};
