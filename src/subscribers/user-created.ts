import {
  SubscriberConfig,
  SubscriberArgs,
  UserService,
} from "@medusajs/medusa";

export default async function handleUserCreated({
  data,
  container,
}: SubscriberArgs) {
  // const sendGridService = container.resolve("sendgridService");
  const UserService: UserService = container.resolve("userService");

  //* Send email to the newly registered user's email to welcome them and let them verify their account
  console.log(`Hello World`);
}

export const config: SubscriberConfig = {
  event: UserService.Events.CREATED,
  context: {
    subscriberId: "user-created-handler",
  },
};
