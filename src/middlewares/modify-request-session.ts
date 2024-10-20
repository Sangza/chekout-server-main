import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { NextFunction } from "express";

export default async function modifyRequestSession(
  request: MedusaRequest,
  response: MedusaResponse,
  next: NextFunction
) {
  //* Edit if session exists

  const domain = process.env.BASE_DOMAIN;
  if (request.session && domain) request.session.cookie.domain = domain;

  // Continue to the next middleware
  next();
}
