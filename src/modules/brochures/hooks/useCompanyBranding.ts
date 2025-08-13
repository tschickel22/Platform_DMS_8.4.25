/**
 * Brochure Builder - Company Branding Hook
 * 
 * This hook provides access to company branding information for use in
 * brochure templates. It returns branding from localStorage or sensible
 * defaults if no branding is configured.
 * 
 * Return Shape:
 * - logoUrl?: string - Company logo URL
 * - primaryColor?: string - Primary brand color (hex)
 * - secondaryColor?: string - Secondary brand color (hex)  
 * - fontFamily?: string - Brand font family
 * - address?: string - Company address
 * - phone?: string - Company phone
 * - email?: string - Company email
 * - website?: string - Company website
 * 
 * Helper Functions:
 * - applyBrandingToTemplate(template) - Fills missing branding fields
 *   from company branding profile
 * 
 * Default Branding (when no branding configured):
 * - primaryColor: '#667eea' (neutral blue)
 * - secondaryColor: '#764ba2' (neutral purple)
 * - fontFamily: 'Inter, system-ui, sans-serif'
 * - logoUrl: null (placeholder will be shown)
 * 
 * Behavior:
 * - Never throws errors
 * - Always returns valid branding object
 * - No external API calls (localStorage only)
 * 
 * TODO: Implement branding retrieval from localStorage
 * TODO: Add branding validation and sanitization
 * TODO: Implement applyBrandingToTemplate helper
 */

import { useMemo } from 'react'
import { BrandingProfile, BrochureTemplate, STORAGE_KEYS } from '../types'

// Default branding when none is configured
const DEFAULT_BRANDING: BrandingProfile = {
  primaryColor: '#667eea',
  secondaryColor: '#764ba2', 
  fontFamily: 'Inter, system-ui, sans-serif',
  logoUrl: undefined, // Will show placeholder
  address: undefined,
  phone: undefined,
  email: undefined,
  website: undefined
}

export const useCompanyBranding = (): BrandingProfile => {
  return useMemo(() => {
    try {
      // TODO: Retrieve branding from localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDING)
      
      if (stored) {
        const parsed = JSON.parse(stored) as BrandingProfile
        
        // Merge with defaults to ensure all fields are present
        return {
          ...DEFAULT_BRANDING,
          ...parsed
        }
      }
    } catch (error) {
      console.warn('Failed to load company branding from localStorage:', error)
    }
    
    // Return defaults if no branding found or parsing failed
    return DEFAULT_BRANDING
  }, [])
}

/**
 * Helper function to apply company branding to a template
 * Fills in missing logo, colors, and fonts from company branding
 * 
 * @param template - Template to apply branding to
 * @returns Template with branding applied
 */
export const applyBrandingToTemplate = (template: BrochureTemplate): BrochureTemplate => {
  // TODO: Get current company branding
  const companyBranding = DEFAULT_BRANDING // Placeholder
  
  // TODO: Merge company branding with template branding
  const mergedBranding: BrandingProfile = {
    ...companyBranding,
    ...template.branding
  }
  
  return {
    ...template,
    branding: mergedBranding
  }
}

/**
 * Hook to get branding with template-specific overrides
 * 
 * @param templateBranding - Optional template-specific branding
 * @returns Merged branding (company + template overrides)
 */
export const useMergedBranding = (templateBranding?: BrandingProfile): BrandingProfile => {
  const companyBranding = useCompanyBranding()
  
  return useMemo(() => {
    return {
      ...companyBranding,
      ...templateBranding
    }
  }, [companyBranding, templateBranding])
}