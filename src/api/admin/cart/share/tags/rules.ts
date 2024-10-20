import { z } from "zod";
import { MedusaError } from "@medusajs/utils";

const rule = z
  .object({
    ids: z.array(z.string()),
    handle: z.string(),
  })
  .partial({ handle: true });

export default function validateShareTag(data: any) {
  const parsed_data = rule.safeParse(data);
  if (parsed_data.success === false) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      JSON.parse(parsed_data.error.message)
    );
  }

  return parsed_data.data;
}
