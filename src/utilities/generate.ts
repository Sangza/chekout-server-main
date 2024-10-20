function tag(length: number) {
  let tag = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charLength = characters.length;

  let counter = 0;
  while (counter < length) {
    tag += characters.charAt(Math.floor(Math.random() * charLength));
    counter += 1;
  }

  return tag;
}

export default function generateTag() {
  return tag(12);
}
