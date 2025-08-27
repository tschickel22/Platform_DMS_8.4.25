import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for common operations
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Local storage utilities with enhanced debugging
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    console.log(`💾 Saving to localStorage[${key}]:`, value)
    localStorage.setItem(key, JSON.stringify(value))
    console.log(`✅ Successfully saved to localStorage[${key}]`)
  } catch (error) {
    console.error(`❌ Failed to save to localStorage[${key}]:`, error)
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      console.log(`📂 localStorage[${key}] not found, using default:`, defaultValue)
      return defaultValue
    }
    const parsed = JSON.parse(item)
    console.log(`📂 Loaded from localStorage[${key}]:`, parsed)
    return parsed
  } catch (error) {
    console.error(`❌ Failed to load from localStorage[${key}]:`, error)
    return defaultValue
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    console.log(`🗑️ Removing from localStorage[${key}]`)
    localStorage.removeItem(key)
    console.log(`✅ Successfully removed localStorage[${key}]`)
  } catch (error) {
    console.error(`❌ Failed to remove from localStorage[${key}]:`, error)
  }
}