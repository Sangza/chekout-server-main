import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager, MoreThan } from "typeorm";
import WhatsappWebhookData from "../type";
import {
  ChekoutEvent,
  chekoutEvents,
} from "../../../../../../models/chekout_event";
import markIncomingMesageAsRead from "../../../../../../utilities/meta_whatsapp/read_incoming_message";
import replyIncomingMessage from "../../../../../../utilities/meta_whatsapp/reply_a_message";
import { User } from "../../../../../../models/user";

export default async function HandlePostRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages

  // req.query["hub.verify_token"]

  const manager: EntityManager = req.scope.resolve("manager");
  const eventRepo = manager.getRepository(ChekoutEvent);
  const userRepo = manager.getRepository(User);
  const requestBody = req.body as WhatsappWebhookData;
  const message = requestBody.entry?.[0]?.changes[0]?.value?.messages?.[0];
  const username =
    requestBody.entry?.[0]?.changes[0]?.value?.contacts[0]?.profile.name;

  // check if the incoming message event contains a text type (which indicates a text reply from the recipient)
  if (message?.type === "text") {
    // Sending a text means the user is interacting with the platform and that means they are trying to verify their phone number
    const recievedCode = message.text.body;

    // Remove the prefix if present
    const code = recievedCode.replace(/CT-/i, "");

    const recipientPhone = message.from.replace(/\+/, "");

    // Get the most recent phone number update event that is not yet expired
    const tenMinutesAgo = () => new Date(Date.now() - 10 * 60 * 1000);
    const event = await eventRepo.findOne({
      where: {
        created_at: MoreThan(tenMinutesAgo()),
        phone: recipientPhone,
        event_type: chekoutEvents.update_phone,
      },
      order: {
        created_at: "DESC",
      },
    });

    const isTokenInvalid = event === null || event.code !== code;

    if (isTokenInvalid) {
      //* Reply Message and tell them that it is the wrong code
      await replyIncomingMessage(
        recipientPhone,
        "This verification token is invalid",
        message.id
      );
    } else {
      //* Update user phone number
      await userRepo.update(event.user_id, {
        phone: event.phone,
      });

      //* Delete all phone_update events initiated by the user
      await eventRepo.delete(event.user_id);

      await replyIncomingMessage(
        recipientPhone,
        "We have recieved your verification token and your number has been updated sucessfully. Cheers.",
        message.id
      );
    }

    // Mark incoming message as read...
    await markIncomingMesageAsRead(message.id);
  }

  res.sendStatus(200);
}
