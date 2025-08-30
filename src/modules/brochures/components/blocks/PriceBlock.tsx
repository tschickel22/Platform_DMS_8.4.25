/**
 * Brochure Builder - Price Block Component
 * 
 * Price display block with formatting and currency support.
 * Handles null values gracefully and provides clear pricing information.
 * 
 * Props:
 * - amount: Price amount (number)
 * - label: Price label/description
 * - currency: Currency code (default: USD)
 * - showCents: Whether to show cents (default: false)
 * - originalPrice: Optional original price for comparison
 * - theme: Visual theme for styling
 * - branding: Company branding for colors
 * 
 * Features:
 * - Currency formatting
 * - Null/undefined handling (shows "—")
 * - Original price strikethrough
 * - Responsive text sizing
 * - Theme-aware styling
 */

import React from 'react'
import { ThemeId, BrandingProfile } from '../../types'
import { DollarSign, Tag } from 'lucide-react'

export interface PriceBlockProps {
  type: 'price'
  amount?: number | null
  label?: string
  currency?: string
  showCents?: boolean
  originalPrice?: number | null
  theme?: ThemeId
  branding?: BrandingProfile
}

/**
 * Price block component
 */
export const PriceBlock: React.FC<PriceBlockProps> = ({
  amount,
  label = 'Price',
  currency = 'USD',
  showCents = false,
  originalPrice,
  theme = 'sleek',
  branding,
}) => {
  // Format currency value
  const formatPrice = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return '—'
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: showCents ? 2 : 0,
        maximumFractionDigits: showCents ? 2 : 0,
      }).format(value)
    } catch (error) {
      // Fallback formatting if currency code is invalid
      const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: showCents ? 2 : 0,
        maximumFractionDigits: showCents ? 2 : 0,
      })
      return `$${formatted}`
    }
  }

  // Calculate savings if original price exists
  const savings = originalPrice && amount && originalPrice > amount 
    ? originalPrice - amount 
    : null

  // Get accent color from branding
  const getAccentColor = () => {
    if (branding?.primary) return branding.primary
    
    switch (theme) {
      case 'card':
        return '#059669' // green-600
      case 'poster':
        return '#DC2626' // red-600
      default:
        return '#1F2937' // gray-800
    }
  }

  const accentColor = getAccentColor()

  // Theme-specific styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'card':
        return {
          container: 'p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center',
          label: 'text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide',
          price: 'text-4xl md:text-5xl font-bold mb-2',
          originalPrice: 'text-lg text-gray-500 line-through mb-1',
          savings: 'text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block',
        }
      case 'poster':
        return {
          container: 'p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg border-2 text-center',
          label: 'text-base font-bold text-gray-800 mb-3 uppercase tracking-widest',
          price: 'text-5xl md:text-6xl font-black mb-3',
          originalPrice: 'text-xl text-gray-600 line-through mb-2',
          savings: 'text-base font-bold text-red-600 bg-white px-4 py-2 rounded-full inline-block shadow-sm',
        }
      default: // sleek
        return {
          container: 'p-4 text-center',
          label: 'text-sm font-medium text-gray-700 mb-1',
          price: 'text-3xl md:text-4xl font-semibold mb-1',
          originalPrice: 'text-base text-gray-500 line-through mb-1',
          savings: 'text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded inline-block',
        }
    }
  }

  const themeClasses = getThemeClasses()
  const formattedPrice = formatPrice(amount)
  const formattedOriginalPrice = formatPrice(originalPrice)
  const formattedSavings = formatPrice(savings)

  return (
    <div className={`price-block ${themeClasses.container}`}>
      {/* Price label */}
      <div 
        className={themeClasses.label}
        style={{ fontFamily: branding?.fontFamily || 'inherit' }}
      >
        {label}
      </div>

      {/* Original price (if exists and different) */}
      {originalPrice && originalPrice !== amount && (
        <div className={themeClasses.originalPrice}>
          {formattedOriginalPrice}
        </div>
      )}

      {/* Main price */}
      <div 
        className={themeClasses.price}
        style={{ 
          fontFamily: branding?.fontFamily || 'inherit',
          color: formattedPrice === '—' ? '#9CA3AF' : accentColor
        }}
      >
        {formattedPrice === '—' ? (
          <div className="flex items-center justify-center text-gray-400">
            <Tag className="w-8 h-8 mr-2" />
            <span className="text-2xl">Price Available</span>
          </div>
        ) : (
          formattedPrice
        )}
      </div>

      {/* Savings badge */}
      {savings && savings > 0 && (
        <div className={themeClasses.savings}>
          Save {formattedSavings}
        </div>
      )}

      {/* Additional pricing info */}
      {amount && amount > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {currency !== 'USD' && <span>Currency: {currency}</span>}
          {!showCents && amount % 1 !== 0 && (
            <div className="mt-1">
              Exact: {formatPrice(amount)}
            </div>
          )}
        </div>
      )}

      {/* Empty state helper */}
      {formattedPrice === '—' && (
        <div className="mt-2 text-xs text-gray-400">
          Add a price to display here
        </div>
      )}
    </div>
  )
}

// Sample default data for BlockPicker
export const priceBlockDefaults: PriceBlockProps = {
  type: 'price',
  amount: 45000,
  label: 'Starting Price',
  currency: 'USD',
  showCents: false,
  originalPrice: 52000,
}

export default PriceBlock