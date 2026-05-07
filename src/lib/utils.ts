import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(address: string, prefix = 4, suffix = 4) {
  if (address.length <= prefix + suffix + 3) return address;
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function scoreTone(score: number) {
  if (score >= 82) return "text-emerald-200";
  if (score >= 64) return "text-amber-200";
  return "text-rose-200";
}

export function stableHash(input: unknown) {
  const json = JSON.stringify(input);
  let hash = 5381;
  for (let index = 0; index < json.length; index += 1) {
    hash = (hash * 33) ^ json.charCodeAt(index);
  }
  return `tn_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
