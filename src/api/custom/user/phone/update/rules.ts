import { z } from "zod";
import { MedusaError } from "@medusajs/utils";

//* Properties
const phone = "phone_number";

const rule = z.object({
  [phone]: z.string().min(3).startsWith("+234"),
});

const validatePhoneNumber = (data: any) => {
  const parsed_data = rule.safeParse(data);

  if (parsed_data.success === false) {
    let error: string;

    const [
      {
        path: [pathName],
        message,
      },
    ] = JSON.parse(parsed_data.error.message);

    if (parsed_data.error.message.includes("required"))
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "phone_number field is required"
      );

    error = (message as string).replace(/String/i, pathName);
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
  }

  return parsed_data.data;
};

export default validatePhoneNumber;
