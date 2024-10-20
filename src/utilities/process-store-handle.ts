// Process Store handle
export default function processStoreHandle(handle: string) {
  // Replace spaces with underscore
  let formattedData = handle.replace(/\s+/g, "_");

  // Remove special characters except for hyphens and underscores
  formattedData = formattedData.replace(/[^\w\-]/g, "");
  return formattedData.toLowerCase();
}
