import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(price);
}

export const base64ToBlob = (base64: string, mimeType: string) => {
  // Decode the Base64 string into binary data
  const byteCharacters = atob(base64); // atob decodes Base64 to a binary string

  // Create a typed array (Uint8Array) to hold the binary data
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i); // Get char code of each binary character
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create and return the Blob
  return new Blob([byteArray], { type: mimeType });
};
