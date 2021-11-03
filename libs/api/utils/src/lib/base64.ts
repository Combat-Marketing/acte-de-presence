/**
 * Encode a string to base 64
 * @param value
 */
export function encode(value: string): string {
  return Buffer.from(value, "binary").toString("base64");
}

// Decode from base64
export function decode(value: string): string {
  return Buffer.from(value, "base64").toString("binary");
}


