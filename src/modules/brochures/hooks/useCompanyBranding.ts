import { useTenant } from '@/contexts/TenantContext'

export function useCompanyBranding() {
  const { tenant } = useTenant()

  const branding = {
    logo: tenant?.branding?.logo || null,
    primaryColor: tenant?.branding?.primaryColor || '#3b82f6',
    secondaryColor: tenant?.branding?.secondaryColor || '#64748b',
    fontFamily: tenant?.branding?.fontFamily || 'Inter',
    companyName: tenant?.name || 'Company Name'
  }

  return React.useMemo(() => ({
    branding,
    isLoaded: !!tenant
  }), [tenant])
}