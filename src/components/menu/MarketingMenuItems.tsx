import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe, Settings } from 'lucide-react'
import { computeWebsiteBuilderCaps } from '@/shared/featureFlags'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { cn } from '@/lib/utils'

export default function MarketingMenuItems() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()
  
  const roles = user?.role ? [user.role] : []
  const companyId = tenant?.id || null
  
  const caps = computeWebsiteBuilderCaps({ roles, companyId })

  const isActive = (path: string) => {
    const current = location.pathname
    return current === path || current.startsWith(path + '/')
  }

  if (!caps.visibleInPlatformMenu && !caps.visibleInCompanyMenu) {
    return null
  }

  return (
    <>
      {caps.visibleInPlatformMenu && (
        <Link
          to="/platform/website-builder"
          className={cn(
            'group flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
            isActive('/platform/website-builder')
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Globe
            className={cn(
              'mr-3 flex-shrink-0 h-4 w-4',
              isActive('/platform/website-builder') ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
          />
          Website Builder
        </Link>
      )}
      
      {caps.visibleInCompanyMenu && (
        <Link
          to="/company/settings/website"
          className={cn(
            'group flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
            isActive('/company/settings/website')
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings
            className={cn(
              'mr-3 flex-shrink-0 h-4 w-4',
              isActive('/company/settings/website') ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
          />
          Website
        </Link>
      )}
    </>
  )
}