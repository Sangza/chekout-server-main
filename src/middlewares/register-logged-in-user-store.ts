import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  User,
  Store,
} from "@medusajs/medusa";
import StoreService from "../services/store";
import { userNotAVendor } from "../errors/messages";
import { loggedInUserVar } from "./register-logged-in-user";

export const loggedInStoreVar = "loggedInStore";

async function registerLoggedInStore(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  let _loggedInUser: User | null;
  try {
    _loggedInUser = req.scope.resolve(loggedInUserVar);
  } catch (err) {
    // avoid errors when backend first runs
  }

  if (!_loggedInUser)
    return res.status(401).send({
      type: "unauthorized",
      message:
        "This user is not authorised to view administrative store products",
    });

  const storeService = req.scope.resolve("storeService") as StoreService;
  let loggedInStore: Store | null;

  try {
    loggedInStore = await storeService.retrieveForLoggedInUser({
      relations: ["owner"],
    }); // Returns store of the logged in user else throws an error
  } catch (err) {
    // Error gotten from retrieving store
    // loggedInStore = null;
    return res.status(401).send(userNotAVendor);
  }

  // Registers the logged user to the dependency container
  req.scope.register({
    loggedInStore: {
      resolve: () => loggedInStore,
    },
  });
  next();
}

export default registerLoggedInStore;
