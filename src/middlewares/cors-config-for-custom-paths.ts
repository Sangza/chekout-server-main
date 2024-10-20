import cors from "cors";
import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";

const CUSTOM_CORS = process.env.CUSTOM_CORS || "http://localhost:7000";

function CorsForCustomPath(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  return cors({
    origin: CUSTOM_CORS,
    credentials: true,
  })(req, res, next);
}

const routes = ["/custom*", "/admin*"];

export default function CorsForRoutes() {
  return routes.map(route => ({
    matcher: route,
    middlewares: [CorsForCustomPath],
  }));
}
