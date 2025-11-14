export function validateRequiredFields(obj: any, fields: string[]) {
  const missing = fields.filter((f) => obj[f] == null);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}
