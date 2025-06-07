import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class values to be combined
 * @returns A single string of combined and optimized class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a human-readable format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Creates a URL-friendly slug from a string
 * @param str - String to convert to a slug
 * @returns URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - String to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return `${str.substring(0, length)}...`
}

/**
 * Creates a promise that resolves after a specified delay
 * @param ms - The number of milliseconds to delay
 * @returns A promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Checks if the current environment is development
 * @returns Boolean indicating if in development environment
 */
export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

/**
 * Gets the base URL for API requests
 * @returns The base URL for the current environment
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

/**
 * Gets the full URL for a given path
 * @param path - The path to append to the base URL
 * @returns The full URL
 */
export function getFullUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param value - The value to check
 * @returns Boolean indicating if the value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Deeply merges two objects
 * @param target - The target object
 * @param source - The source object
 * @returns A new object with merged properties
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const output = { ...target } as T & U
  
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof U
      const targetKey = key as keyof T
      
      if (isPlainObject(source[sourceKey])) {
        if (!(targetKey in target)) {
          Object.assign(output, { [key]: source[sourceKey] })
        } else {
          output[targetKey] = deepMerge(target[targetKey] as any, source[sourceKey] as any) as any
        }
      } else if (Array.isArray(source[sourceKey]) && Array.isArray(target[targetKey])) {
        output[targetKey] = [...(target[targetKey] as any), ...(source[sourceKey] as any)] as any
      } else {
        Object.assign(output, { [key]: source[sourceKey] })
      }
    })
  }
  
  return output
}

/**
 * Checks if a value is a plain object
 * @param value - The value to check
 * @returns Boolean indicating if the value is a plain object
 */
function isPlainObject(value: any): value is object {
  return Object.prototype.toString.call(value) === '[object Object]' && value !== null
}

/**
 * Creates a debounced function that delays invoking the provided function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(later, wait)
  }
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every wait milliseconds
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle invocations to
 * @returns A throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Gets a cookie value by name
 * @param name - The name of the cookie
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  
  return null
}

/**
 * Sets a cookie
 * @param name - The name of the cookie
 * @param value - The value to set
 * @param days - The number of days until the cookie expires
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return
  
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; path=/; samesite=lax${
    process.env.NODE_ENV === 'production' ? '; secure' : ''
  }`
}

/**
 * Removes a cookie by name
 * @param name - The name of the cookie to remove
 */
export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Gets a header value from the current request
 * @param header - The name of the header to get
 * @param headers - Optional headers object (for server components)
 * @returns The header value or null if not found
 */
export function getHeader(
  header: string,
  headers?: Headers | Record<string, string | string[] | undefined> | { get: (key: string) => string | null }
): string | null {
  // Client-side
  if (typeof window !== 'undefined') {
    return null
  }
  
  // Server-side with Headers or similar interface
  if (headers && 'get' in headers && typeof headers.get === 'function') {
    return headers.get(header)
  }
  
  // Server-side with plain object
  if (headers && header in headers) {
    const value = (headers as Record<string, any>)[header]
    return Array.isArray(value) ? value[0] : value || null
  }
  
  return null
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats a number with commas as thousand separators
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number | string): string {
  return Number(num).toLocaleString()
}

/**
 * Generates a unique ID
 * @returns A unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Converts a string to title case
 * @param str - The string to convert
 * @returns The string in title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Trims whitespace from both ends of a string and normalizes internal whitespace
 * @param str - The string to normalize
 * @returns The normalized string
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

/**
// sleep function is now called delay to avoid naming conflicts
// Use delay(ms) instead of sleep(ms)

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Checks if a value is a valid email address
 * @param email - The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

/**
 * Creates a function that can only be called once
 * @param func - The function to be called once
 * @returns A function that can only be called once
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false
  let result: ReturnType<T>
  
  return function(...args: Parameters<T>) {
    if (!called) {
      called = true
      result = func(...args)
    }
    return result
  } as T
}

/**
 * Generates a random string of specified length
 * @param length - Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Converts an object to a query string
 * @param params - Object with query parameters
 * @returns URL-encoded query string
 */
export function toQueryString(params: Record<string, any>): string {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString()
}
