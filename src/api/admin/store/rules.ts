import { z } from "zod";
import { MedusaError } from "@medusajs/utils";

//* Properties
const name = "store_name";
const desc = "description";
const handle = "handle";

const rule = z.object({
  [name]: z.string(),
  [desc]: z.string().min(3),
  [handle]: z.string().min(3),
});

const validateStore = (data: any) => {
  const parsed_data = rule.safeParse(data);

  if (parsed_data.success === false) {
    let error: string;

    const [
      {
        path: [pathName],
        message,
      },
    ] = JSON.parse(parsed_data.error.message);

    if (pathName === desc) {
      error = (message as string).replace(/String/i, "");
    } else {
      error = message;
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${pathName} ${message}`
    );
  }

  return parsed_data.data;
};

export default validateStore;
