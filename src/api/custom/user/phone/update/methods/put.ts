import crypto from "crypto";
import { EntityManager } from "typeorm";
import { MedusaRequest, MedusaResponse, User } from "@medusajs/medusa";
import validatePhoneNumber from "../rules";
import {
  ChekoutEvent,
  chekoutEvents,
} from "../../../../../../models/chekout_event";
import { loggedInUserVar } from "../../../../../../middlewares/register-logged-in-user";
import sendWhatsappTextMessageForPhoneUpdate from "../../../../../../utilities/meta_whatsapp/phone_update";

export default async function HandlePutRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { phone_number } = validatePhoneNumber(req.body);
  const phone = phone_number.replace(/\+/, "");

  const manager: EntityManager = req.scope.resolve("manager");
  const eventRepo = manager.getRepository(ChekoutEvent);
  const currentUser = req.scope.resolve(loggedInUserVar) as User;

  //* Generate code
  const verificationCode = crypto.randomBytes(3).toString("hex");

  //* Send whatsapp message to user's phone number
  try {
    await sendWhatsappTextMessageForPhoneUpdate(
      phone,
      currentUser.first_name,
      verificationCode
    );
  } catch (err) {
    return res.status(400).send({
      type: "medusa_error",
      message: err.message,
    });
  }

  //* save to the event database
  const newEvent = eventRepo.create({
    event_type: chekoutEvents.update_phone,
    user_id: currentUser.id,
    code: verificationCode,
    phone,
  });
  await eventRepo.save(newEvent);

  res.status(200).send({
    verification: "Pending",
    message:
      "A whatsapp text has been sent to your number. Check it to continue verification",
  });
}
