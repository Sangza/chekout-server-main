import { string, z } from "zod";
import { MedusaError } from "@medusajs/utils";
import { LineItem } from "@medusajs/medusa";

const rule = z.object({
  items: z.array(z.any()),
  cart_id: string(),
});

export default function validateAddFromTag(data: any) {
  const parsed_data = rule.safeParse(data);

  if (parsed_data.success === false) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      JSON.parse(parsed_data.error.message)
    );
  }

  return parsed_data.data;
}
