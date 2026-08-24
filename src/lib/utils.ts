import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number | null | undefined): string {
  if (!price || price <= 0) return "Price on request";
  return `₹${price.toLocaleString("en-IN")} / night`;
}

export function formatDateReadable(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

