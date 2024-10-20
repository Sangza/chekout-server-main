import { AUTHORIZATION_TOKEN, whatsappMessagingRoute } from ".";

const sendWhatsappTextMessageForPhoneUpdate = async (
  recipientPhone: string,
  firstName: string,
  code: string
) => {
  const response = await fetch(whatsappMessagingRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTHORIZATION_TOKEN}`,
    },
    body: JSON.stringify({
      to: recipientPhone,
      language: { code: "en" },
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: "phone_verification",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: firstName,
              },
              {
                type: "text",
                text: code,
              },
            ],
          },
        ],
      },
    }),
  });

  if (response.status !== 200) {
    const data = await response.json();
    console.log(data);
    throw new Error("Something went wrong while making your request to meta");
  }

  const data = await response.json();
  const {
    messages: [{ message_status }],
  } = data;

  if (message_status !== "accepted")
    throw new Error("You are not allowed to send this message");
};

export default sendWhatsappTextMessageForPhoneUpdate;
