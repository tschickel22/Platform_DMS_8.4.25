/**
 * Brochure Builder - Token Resolution Utilities
 * 
 * This module provides token-based content replacement for dynamic brochures.
 * Tokens like {{inventory.price}} or {{listing.title}} are replaced with actual
 * values from the provided context data, enabling data-driven brochure generation.
 * 
 * Supported Token Categories:
 * - Inventory: {{inventory.year}}, {{inventory.make}}, {{inventory.model}}, etc.
 * - Listings: {{listing.title}}, {{listing.price}}, {{listing.location}}, etc.
 * - Land: {{land.acres}}, {{land.price}}, {{land.location}}, etc.
 * - Quotes: {{quote.total}}, {{quote.items}}, {{quote.customer}}, etc.
 * - Company: {{company.name}}, {{company.phone}}, {{company.address}}, etc.
 * - User: {{user.name}}, {{user.email}}, {{user.title}}, etc.
 * - Custom: {{custom.field1}}, {{custom.field2}}, etc.
 * 
 * Token Format:
 * - Basic: {{category.field}}
 * - Nested: {{category.subcategory.field}}
 * - Formatted: {{inventory.price|currency}}
 * - Conditional: {{inventory.year|default:'N/A'}}
 * 
 * Resilience Features:
 * - Never throws errors on missing tokens
 * - Returns original text for unresolved tokens
 * - Supports fallback values and default formatting
 * - Handles nested object access safely
 * - Provides helpful debugging information
 * 
 * Performance:
 * - Efficient regex-based token detection
 * - Caches resolved values within context
 * - Minimal string manipulation overhead
 * - Supports batch token resolution
 * 
 * TODO: Add support for conditional tokens (if/else)
 * TODO: Add mathematical operations (sum, multiply, etc.)
 * TODO: Add date/time formatting options
 * TODO: Add localization support for formatting
 * TODO: Add token validation and suggestions
 */

import type { TokenContext } from '../types'

/**
 * Token pattern for matching {{category.field}} format
 */
const TOKEN_PATTERN = /\{\{([^}]+)\}\}/g

/**
 * Supported token formatters
 */
export type TokenFormatter = 
  | 'currency'
  | 'number'
  | 'date'
  | 'phone'
  | 'address'
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'truncate'
  | 'default'

/**
 * Token resolution options
 */
export interface TokenResolutionOptions {
  // Fallback behavior
  keepUnresolved?: boolean // Keep {{token}} if not found (default: true)
  defaultValue?: string // Default value for missing tokens
  
  // Formatting options
  currency?: string // Currency code (USD, EUR, etc.)
  locale?: string // Locale for formatting (en-US, etc.)
  
  // Debug options
  debug?: boolean // Log resolution details
  strict?: boolean // Throw errors on missing tokens
}

/**
 * Token resolution result
 */
export interface TokenResolutionResult {
  originalText: string
  resolvedText: string
  tokensFound: string[]
  tokensResolved: string[]
  tokensUnresolved: string[]
  errors: string[]
}

/**
 * Main token resolution function
 * 
 * Replaces tokens in the input text with values from the provided context.
 * Handles missing tokens gracefully and supports various formatting options.
 * 
 * @param input - Text containing tokens to resolve
 * @param context - Data context for token resolution
 * @param options - Resolution options and formatting preferences
 * @returns Resolved text with tokens replaced
 */
export const resolveTokens = (
  input: string,
  context: TokenContext = {},
  options: TokenResolutionOptions = {}
): string => {
  if (!input || typeof input !== 'string') {
    return input || ''
  }
  
  const {
    keepUnresolved = true,
    defaultValue = '',
    debug = false,
    strict = false
  } = options
  
  try {
    return input.replace(TOKEN_PATTERN, (match, tokenPath) => {
      try {
        const resolved = resolveTokenPath(tokenPath.trim(), context, options)
        
        if (debug) {
          console.log(`Token resolved: ${match} -> ${resolved}`)
        }
        
        return resolved !== null ? resolved : (keepUnresolved ? match : defaultValue)
        
      } catch (error) {
        if (strict) {
          throw error
        }
        
        if (debug) {
          console.warn(`Token resolution failed: ${match}`, error)
        }
        
        return keepUnresolved ? match : defaultValue
      }
    })
    
  } catch (error) {
    if (strict) {
      throw error
    }
    
    console.error('Token resolution failed:', error)
    return input
  }
}

/**
 * Resolves a single token path with optional formatting
 * 
 * @param tokenPath - Token path like "inventory.price|currency"
 * @param context - Data context
 * @param options - Resolution options
 * @returns Resolved and formatted value or null if not found
 */
const resolveTokenPath = (
  tokenPath: string,
  context: TokenContext,
  options: TokenResolutionOptions
): string | null => {
  // Parse token path and formatter
  const [path, formatter, ...formatterArgs] = tokenPath.split('|')
  const pathParts = path.split('.')
  
  // Navigate to the value
  let value = getNestedValue(context, pathParts)
  
  // Apply formatter if specified
  if (value !== null && formatter) {
    value = applyFormatter(value, formatter as TokenFormatter, formatterArgs, options)
  }
  
  return value
}

/**
 * Safely gets a nested value from an object
 * 
 * @param obj - Object to navigate
 * @param path - Array of property names
 * @returns Value at path or null if not found
 */
const getNestedValue = (obj: any, path: string[]): any => {
  try {
    let current = obj
    
    for (const key of path) {
      if (current === null || current === undefined) {
        return null
      }
      
      if (typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return null
      }
    }
    
    return current
    
  } catch (error) {
    return null
  }
}

/**
 * Applies formatting to a resolved value
 * 
 * @param value - Raw value to format
 * @param formatter - Formatter type
 * @param args - Formatter arguments
 * @param options - Resolution options
 * @returns Formatted value as string
 */
const applyFormatter = (
  value: any,
  formatter: TokenFormatter,
  args: string[],
  options: TokenResolutionOptions
): string => {
  try {
    switch (formatter) {
      case 'currency':
        return formatCurrency(value, options.currency || 'USD', options.locale)
        
      case 'number':
        return formatNumber(value, options.locale)
        
      case 'date':
        return formatDate(value, args[0] || 'short', options.locale)
        
      case 'phone':
        return formatPhone(value)
        
      case 'address':
        return formatAddress(value)
        
      case 'uppercase':
        return String(value).toUpperCase()
        
      case 'lowercase':
        return String(value).toLowerCase()
        
      case 'capitalize':
        return capitalizeWords(String(value))
        
      case 'truncate':
        const length = parseInt(args[0]) || 50
        return truncateText(String(value), length)
        
      case 'default':
        return value || args[0] || ''
        
      default:
        console.warn(`Unknown formatter: ${formatter}`)
        return String(value)
    }
    
  } catch (error) {
    console.error(`Formatter error (${formatter}):`, error)
    return String(value)
  }
}

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Formats a number as currency
 */
const formatCurrency = (value: any, currency: string = 'USD', locale: string = 'en-US'): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return String(value)
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(num)
  } catch (error) {
    return `$${num.toFixed(2)}`
  }
}

/**
 * Formats a number with locale-specific formatting
 */
const formatNumber = (value: any, locale: string = 'en-US'): string => {
  const num = parseFloat(value)
  if (isNaN(num)) return String(value)
  
  try {
    return new Intl.NumberFormat(locale).format(num)
  } catch (error) {
    return num.toString()
  }
}

/**
 * Formats a date value
 */
const formatDate = (value: any, format: string = 'short', locale: string = 'en-US'): string => {
  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)
  
  try {
    const options: Intl.DateTimeFormatOptions = {}
    
    switch (format) {
      case 'short':
        options.dateStyle = 'short'
        break
      case 'medium':
        options.dateStyle = 'medium'
        break
      case 'long':
        options.dateStyle = 'long'
        break
      case 'full':
        options.dateStyle = 'full'
        break
      default:
        options.dateStyle = 'short'
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (error) {
    return date.toLocaleDateString()
  }
}

/**
 * Formats a phone number
 */
const formatPhone = (value: any): string => {
  const phone = String(value).replace(/\D/g, '')
  
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  } else if (phone.length === 11 && phone[0] === '1') {
    return `+1 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`
  }
  
  return String(value)
}

/**
 * Formats an address object or string
 */
const formatAddress = (value: any): string => {
  if (typeof value === 'string') {
    return value
  }
  
  if (typeof value === 'object' && value !== null) {
    const parts = [
      value.street || value.address1,
      value.address2,
      value.city,
      value.state,
      value.postalCode || value.zip
    ].filter(Boolean)
    
    return parts.join(', ')
  }
  
  return String(value)
}

/**
 * Capitalizes words in a string
 */
const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Truncates text to specified length
 */
const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length - 3) + '...'
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Resolves tokens in multiple strings at once
 * 
 * @param inputs - Array of strings to process
 * @param context - Token context
 * @param options - Resolution options
 * @returns Array of resolved strings
 */
export const resolveTokensBatch = (
  inputs: string[],
  context: TokenContext,
  options: TokenResolutionOptions = {}
): string[] => {
  return inputs.map(input => resolveTokens(input, context, options))
}

/**
 * Finds all tokens in a string without resolving them
 * 
 * @param input - Text to analyze
 * @returns Array of unique token strings
 */
export const findTokens = (input: string): string[] => {
  if (!input || typeof input !== 'string') {
    return []
  }
  
  const tokens: string[] = []
  let match
  
  while ((match = TOKEN_PATTERN.exec(input)) !== null) {
    tokens.push(match[1].trim())
  }
  
  // Reset regex state
  TOKEN_PATTERN.lastIndex = 0
  
  return [...new Set(tokens)] // Remove duplicates
}

/**
 * Validates that all tokens in a string can be resolved
 * 
 * @param input - Text to validate
 * @param context - Token context
 * @returns Validation result with details
 */
export const validateTokens = (
  input: string,
  context: TokenContext
): TokenResolutionResult => {
  const tokensFound = findTokens(input)
  const tokensResolved: string[] = []
  const tokensUnresolved: string[] = []
  const errors: string[] = []
  
  for (const token of tokensFound) {
    try {
      const resolved = resolveTokenPath(token, context, {})
      if (resolved !== null) {
        tokensResolved.push(token)
      } else {
        tokensUnresolved.push(token)
      }
    } catch (error) {
      tokensUnresolved.push(token)
      errors.push(`${token}: ${error.message}`)
    }
  }
  
  return {
    originalText: input,
    resolvedText: resolveTokens(input, context),
    tokensFound,
    tokensResolved,
    tokensUnresolved,
    errors
  }
}

// =============================================================================
// PREDEFINED TOKEN SETS
// =============================================================================

/**
 * Common inventory tokens
 */
export const INVENTORY_TOKENS = [
  'inventory.id',
  'inventory.year',
  'inventory.make',
  'inventory.model',
  'inventory.vin',
  'inventory.price',
  'inventory.salePrice',
  'inventory.rentPrice',
  'inventory.condition',
  'inventory.mileage',
  'inventory.color',
  'inventory.bedrooms',
  'inventory.bathrooms',
  'inventory.length',
  'inventory.width',
  'inventory.sleeps',
  'inventory.slides'
]

/**
 * Common listing tokens
 */
export const LISTING_TOKENS = [
  'listing.id',
  'listing.title',
  'listing.description',
  'listing.price',
  'listing.location.city',
  'listing.location.state',
  'listing.location.address',
  'listing.features',
  'listing.images',
  'listing.status'
]

/**
 * Common company tokens
 */
export const COMPANY_TOKENS = [
  'company.name',
  'company.phone',
  'company.email',
  'company.address',
  'company.website',
  'company.logo'
]

/**
 * All available tokens organized by category
 */
export const ALL_TOKENS = {
  inventory: INVENTORY_TOKENS,
  listing: LISTING_TOKENS,
  company: COMPANY_TOKENS
}

export default {
  resolveTokens,
  resolveTokensBatch,
  findTokens,
  validateTokens,
  ALL_TOKENS
}