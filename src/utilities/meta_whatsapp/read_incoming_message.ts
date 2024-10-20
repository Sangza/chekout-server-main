import { AUTHORIZATION_TOKEN, whatsappMessagingRoute } from ".";

export default async function markIncomingMesageAsRead(message_id: string) {
  await fetch(whatsappMessagingRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZATION_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id,
    }),
  });
}
