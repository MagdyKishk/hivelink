import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function that combines Tailwind CSS classes using clsx and tailwind-merge
 * This helps prevent class conflicts and allows for conditional class application
 * 
 * @param inputs - Array of class values to be combined
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
