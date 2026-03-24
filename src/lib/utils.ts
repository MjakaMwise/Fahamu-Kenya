import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely convert a string to lowercase, handling null and undefined values
 * @param value The string to convert
 * @returns Lowercase string or empty string if value is null/undefined
 */
export function safeToLowerCase(value: string | null | undefined): string {
  return value?.toString().toLowerCase() ?? "";
}