import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
export default async function HandleGetRequest(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(token);

  // check the mode and token sent are correct
  if (
    mode === "subscribe" &&
    token === process.env.META_WHATSAPP_WEBHOOK_VERIFICATION_TOKEN
  ) {
    //* respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    //* respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
}
