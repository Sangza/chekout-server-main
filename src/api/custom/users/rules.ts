import { z } from "zod";

//* Properties
const password = "password";
const firstName = "first_name";
const lastName = "last_name";
const email = "email";
const creating_store = "creating_store";

const rule = z.object({
  [email]: z.string().email(),
  [firstName]: z.string().min(3),
  [lastName]: z.string().min(3),
  [password]: z.string().min(3),
  [creating_store]: z.boolean(),
});

const validateUser = (data: any) => {
  const parsed_data = rule.safeParse(data);

  if (parsed_data.success === false) {
    let error: string;
    const [
      {
        path: [pathName],
        message,
      },
    ] = JSON.parse(parsed_data.error.message);

    if (
      pathName === password ||
      pathName === firstName ||
      pathName === lastName ||
      pathName === creating_store
    ) {
      error = (
        pathName +
        " " +
        (message as string).replace(/^String/i, "")
      ).toLowerCase();
    } else {
      error = message;
    }

    throw new Error(error);
  }

  return parsed_data.data;
};

export default validateUser;
