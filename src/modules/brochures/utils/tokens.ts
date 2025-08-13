/**
 * Brochure Builder - Token Resolution Utility
 * 
 * This utility handles dynamic token replacement in brochure content.
 * Tokens like {{inventory.price}} or {{listing.title}} are replaced
 * with actual values from the context data.
 * 
 * Supported Token Categories:
 * 
 * Inventory Tokens:
 * - {{inventory.make}} - Vehicle/unit make
 * - {{inventory.model}} - Vehicle/unit model  
 * - {{inventory.year}} - Year manufactured
 * - {{inventory.price}} - Sale price
 * - {{inventory.vin}} - VIN/serial number
 * - {{inventory.condition}} - New/used condition
 * - {{inventory.mileage}} - Odometer reading
 * 
 * Listing Tokens:
 * - {{listing.title}} - Listing title
 * - {{listing.description}} - Listing description
 * - {{listing.price}} - Listed price
 * - {{listing.location}} - Property location
 * - {{listing.bedrooms}} - Number of bedrooms
 * - {{listing.bathrooms}} - Number of bathrooms
 * 
 * Land Tokens:
 * - {{land.address}} - Land address
 * - {{land.acreage}} - Land size in acres
 * - {{land.price}} - Land price
 * - {{land.zoning}} - Zoning classification
 * 
 * Quote Tokens:
 * - {{quote.total}} - Quote total amount
 * - {{quote.items}} - Quote line items
 * - {{quote.customer}} - Customer name
 * - {{quote.date}} - Quote date
 * 
 * Company Tokens:
 * - {{company.name}} - Company name
 * - {{company.phone}} - Company phone
 * - {{company.email}} - Company email
 * - {{company.address}} - Company address
 * - {{company.website}} - Company website
 * 
 * Behavior:
 * - Never throws errors
 * - Unknown tokens return original text (e.g., "{{unknown.token}}")
 * - Missing context data returns empty string or safe fallback
 * - Supports nested object access (e.g., {{inventory.specs.engine}})
 * - Handles arrays with index access (e.g., {{listing.photos.0}})
 * 
 * TODO: Implement token parsing and replacement logic
 * TODO: Add number formatting for prices and measurements
 * TODO: Add date formatting for timestamps
 * TODO: Add conditional token support (e.g., {{if inventory.price}}...{{/if}})
 */

// Token resolution context - data available for replacement
export interface TokenContext {
  inventory?: Record<string, any>
  listing?: Record<string, any>
  land?: Record<string, any>
  quote?: Record<string, any>
  company?: Record<string, any>
  [key: string]: any // Allow additional context data
}

/**
 * Resolves tokens in input text using provided context
 * 
 * @param input - Text containing tokens to replace
 * @param context - Data context for token resolution
 * @returns Text with tokens replaced by actual values
 */
export const resolveTokens = (input: string, context: TokenContext = {}): string => {
  if (!input || typeof input !== 'string') {
    return String(input || '')
  }
  
  try {
    // TODO: Implement token replacement logic
    // Pattern: {{category.property}} or {{category.property.nested}}
    const tokenPattern = /\{\{([^}]+)\}\}/g
    
    return input.replace(tokenPattern, (match, tokenPath) => {
      try {
        // TODO: Parse token path (e.g., "inventory.price" -> ["inventory", "price"])
        const pathParts = tokenPath.trim().split('.')
        
        // TODO: Navigate through context object using path
        let value = context
        for (const part of pathParts) {
          if (value && typeof value === 'object' && part in value) {
            value = value[part]
          } else {
            // Path not found, return original token
            return match
          }
        }
        
        // TODO: Format value based on type
        return formatTokenValue(value)
        
      } catch (error) {
        // Token resolution failed, return original
        console.warn('Token resolution failed:', tokenPath, error)
        return match
      }
    })
    
  } catch (error) {
    console.warn('Token resolution error:', error)
    return input
  }
}

/**
 * Formats a resolved token value for display
 * 
 * @param value - Raw value from context
 * @returns Formatted string for display
 */
const formatTokenValue = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'number') {
    // TODO: Add smart number formatting
    // - Currency formatting for prices
    // - Comma separators for large numbers
    // - Decimal handling
    return value.toLocaleString()
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  
  if (Array.isArray(value)) {
    // TODO: Handle array formatting
    // - Join with commas for lists
    // - Take first item for single values
    return value.join(', ')
  }
  
  if (typeof value === 'object') {
    // TODO: Handle object formatting
    // - JSON stringify for complex objects
    // - Extract meaningful properties
    return JSON.stringify(value)
  }
  
  return String(value)
}

/**
 * Extracts all tokens from input text
 * 
 * @param input - Text to scan for tokens
 * @returns Array of token paths found
 */
export const extractTokens = (input: string): string[] => {
  if (!input || typeof input !== 'string') {
    return []
  }
  
  const tokens: string[] = []
  const tokenPattern = /\{\{([^}]+)\}\}/g
  let match
  
  while ((match = tokenPattern.exec(input)) !== null) {
    const tokenPath = match[1].trim()
    if (!tokens.includes(tokenPath)) {
      tokens.push(tokenPath)
    }
  }
  
  return tokens
}

/**
 * Validates if all tokens in input can be resolved with context
 * 
 * @param input - Text containing tokens
 * @param context - Available context data
 * @returns Object with validation results
 */
export const validateTokens = (input: string, context: TokenContext = {}) => {
  const tokens = extractTokens(input)
  const results = {
    valid: [] as string[],
    invalid: [] as string[],
    allValid: true
  }
  
  for (const token of tokens) {
    const resolved = resolveTokens(`{{${token}}}`, context)
    if (resolved === `{{${token}}}`) {
      // Token was not resolved
      results.invalid.push(token)
      results.allValid = false
    } else {
      results.valid.push(token)
    }
  }
  
  return results
}