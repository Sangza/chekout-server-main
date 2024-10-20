import { EntityManager } from "typeorm";
import Scrypt from "scrypt-kdf";
import {
  UserService,
  EventBusService,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import validateUser from "../rules";
import { User } from "../../../../models/user";

export default async function HandlePostRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const userData = validateUser(req.body);
    const eventBusService: EventBusService =
      req.scope.resolve("eventBusService");
    const manager: EntityManager = req.scope.resolve("manager");
    const userRepo = manager.getRepository(User);

    // Check if email is already registered...
    const userExists = await userRepo.exist({
      where: { email: userData.email },
    });

    if (userExists)
      return res.status(401).send({
        type: MedusaError.Types.CONFLICT,
        message:
          "An account with this email already exists, Try logging in instead",
      });

    const password_hash_buffer = await Scrypt.kdf(userData.password, {
      logN: 15,
      r: 8,
      p: 1,
    });
    const password_hash = password_hash_buffer.toString("base64");
    const { email, first_name, last_name } = userData;

    // create user in database
    const newUser = userRepo.create({
      email: email.toLowerCase(),
      first_name,
      last_name,
      auth_type: "password",
      password_hash,
    });
    await userRepo.save(newUser);

    // Remove password from user details
    delete newUser["password_hash"];
    delete newUser["deleted_at"];

    // Return user and send cookies (Sends cookie automatically)
    res.status(201).send({
      message:
        "Account created sucessfully, An email has been sent to verify your account.",
      user: newUser,
    });

    // Send a user.created event - CHEKOUT EVENT
    eventBusService.emit(UserService.Events.CREATED, {
      email: newUser.email,
    });
  } catch (err) {
    return res.status(400).send({
      type: MedusaError.Types.INVALID_DATA,
      message: err.message,
    });
  }
}
