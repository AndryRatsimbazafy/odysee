import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges class names, letting later Tailwind classes win (shadcn helper). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
