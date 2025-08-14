import { useTenant } from '@/contexts/TenantContext'

export interface CompanyBranding {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  companyName: string
  logo?: string
}

export function useCompanyBranding(): CompanyBranding {
  const { tenant } = useTenant()

  return {
    primaryColor: tenant?.branding?.primaryColor || '#3b82f6',
    secondaryColor: tenant?.branding?.secondaryColor || '#64748b',
    fontFamily: tenant?.branding?.fontFamily || 'Inter',
    companyName: tenant?.name || 'Demo Company',
    logo: tenant?.branding?.logo
  }
}