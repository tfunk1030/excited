// Base64 encoded 1x1 transparent PNG
export const TRANSPARENT_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Convert base64 to binary for use in image files
export function base64ToBinary(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}