import { authenticate } from "@medusajs/medusa";
import type { MiddlewaresConfig } from "@medusajs/medusa";
import registerLoggedInUser from "../middlewares/register-logged-in-user";
import registerLoggedInStore from "../middlewares/register-logged-in-user-store";
import { handleStoreThumbnail } from "../middlewares/handling-multipart-form-data";
import CorsForRoutes from "../middlewares/cors-config-for-custom-paths";
import modifyRequestSession from "../middlewares/modify-request-session";

// CORS to avoid issues when consuming Medusa from custom routes
export const config: MiddlewaresConfig = {
  routes: [
    {
      //todo Run for all routes
      matcher: "*",
      middlewares: [modifyRequestSession],
    },
    ...CorsForRoutes(),
    {
      //todo Run for all the admin/store route
      matcher: /^\/(admin\/store)$/,
      middlewares: [
        authenticate(),
        registerLoggedInUser,
        handleStoreThumbnail("thumbnail"),
      ],
    },
    {
      //todo Run for user/phone/update route
      // matcher: /^\/(admin\/store|user\/phone\/update)$/,
      matcher: /^\/custom\/(user\/phone\/update|auth\/verify)$/,
      middlewares: [authenticate(), registerLoggedInUser],
    },
    {
      //todo Run for all routes that begins with /admin (except for the admin/auth and admin/store route)
      matcher: /^\/admin(\/(?!auth\b|store\b)[^\/]*)*$/,
      middlewares: [
        authenticate(),
        registerLoggedInUser,
        registerLoggedInStore,
      ],
    },
  ],
};
