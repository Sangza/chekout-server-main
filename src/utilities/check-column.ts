export default function checkColumn<T>(column, options: T) {
  if (typeof options !== "object") {
    // Chekout error - Typerror
  }

  const is_valid_role = Object.values(options).includes(column);
  if (!is_valid_role) {
    // Chekout error - Database error invalid column option
  }
}
