import { AUTHORIZATION_TOKEN, whatsappMessagingRoute } from ".";

export default async function replyIncomingMessage(
  recipientPhone: string,
  message: string,
  message_id: string
) {
  const res = await fetch(whatsappMessagingRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZATION_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipientPhone,
      text: { body: message },
      context: {
        message_id,
      },
    }),
  });

  const data = await res.json();
}
