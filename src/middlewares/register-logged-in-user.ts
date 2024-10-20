import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  User,
  UserService,
} from "@medusajs/medusa";

export const loggedInUserVar = "loggedInUser";

async function registerLoggedInUser(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  let loggedInUser: User | null = null;

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve("userService") as UserService;
    loggedInUser = await userService.retrieve(req.user.userId);
  }

  // Registers the logged user store to the dependency container
  req.scope.register({
    [loggedInUserVar]: {
      resolve: () => loggedInUser,
    },
  });

  next();
}

export default registerLoggedInUser;
