export type PlatformFlags = {
  websiteBuilder: {
    enabled: boolean
    exposeToCompanies: boolean
  }
  faviconUrl?: string
}

export type CompanyFlags = {
  websiteBuilder?: {
    enabled: boolean
  }
}

export interface WebsiteBuilderCapabilities {
  visibleInPlatformMenu: boolean
  visibleInCompanyMenu: boolean
  canEditContent: boolean
  canManageHosting: boolean
  mode: 'platform' | 'company' | 'none'
}

export function computeWebsiteBuilderCaps({
  roles = [],
  companyId
}: {
  roles: string[]
  companyId?: string | null
}): WebsiteBuilderCapabilities {
  // Get platform flags from localStorage
  const platformFlags = getPlatformFlags()
  const companyFlags = getCompanyFlags(companyId)

  const isPlatformAdmin = roles.includes('platform_admin') || roles.includes('admin')
  const isCompanyUser = !!companyId && roles.length > 0

  // Platform admin capabilities
  if (isPlatformAdmin && platformFlags.websiteBuilder.enabled) {
    return {
      visibleInPlatformMenu: true,
      visibleInCompanyMenu: false,
      canEditContent: true,
      canManageHosting: true,
      mode: 'platform'
    }
  }

  // Company user capabilities
  if (isCompanyUser && 
      platformFlags.websiteBuilder.enabled && 
      platformFlags.websiteBuilder.exposeToCompanies &&
      companyFlags.websiteBuilder?.enabled) {
    return {
      visibleInPlatformMenu: false,
      visibleInCompanyMenu: true,
      canEditContent: true,
      canManageHosting: false,
      mode: 'company'
    }
  }

  return {
    visibleInPlatformMenu: false,
    visibleInCompanyMenu: false,
    canEditContent: false,
    canManageHosting: false,
    mode: 'none'
  }
}

export function getPlatformFlags(): PlatformFlags {
  try {
    const stored = localStorage.getItem('wb2:platform-flags')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load platform flags:', error)
  }

  // Default flags
  return {
    websiteBuilder: {
      enabled: true,
      exposeToCompanies: false
    }
  }
}

export function setPlatformFlags(flags: PlatformFlags): void {
  try {
    localStorage.setItem('wb2:platform-flags', JSON.stringify(flags))
  } catch (error) {
    console.error('Failed to save platform flags:', error)
  }
}

export function getCompanyFlags(companyId?: string | null): CompanyFlags {
  if (!companyId) return {}
  
  try {
    const stored = localStorage.getItem(`wb2:company-flags:${companyId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load company flags:', error)
  }

  return {}
}

export function setCompanyFlags(companyId: string, flags: CompanyFlags): void {
  try {
    localStorage.setItem(`wb2:company-flags:${companyId}`, JSON.stringify(flags))
  } catch (error) {
    console.error('Failed to save company flags:', error)
  }
}