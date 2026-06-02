import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * @example
 * cn("px-4 py-2", "bg-blue-500", condition && "text-white")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
