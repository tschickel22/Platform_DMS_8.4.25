import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { computeWebsiteBuilderCaps } from '@/shared/featureFlags'
import WebsiteBuilder from './WebsiteBuilder'
import SiteEditor from './components/SiteEditor'

export function WebsiteBuilderRoutes() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  
  const roles = user?.role ? [user.role] : []
  const companyId = tenant?.id || null
  const caps = computeWebsiteBuilderCaps({ roles, companyId })

  if (!caps.visibleInPlatformMenu) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access the Website Builder.</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<WebsiteBuilder mode="platform" />} />
      <Route path="/:siteId" element={<SiteEditor mode="platform" />} />
      <Route path="/:siteId" element={<div>Site Editor (Platform Mode)</div>} />
    </Routes>
  )
}

export function CompanyWebsiteRoutes() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  
  const roles = user?.role ? [user.role] : []
  const companyId = tenant?.id || null
  const caps = computeWebsiteBuilderCaps({ roles, companyId })

  if (!caps.visibleInCompanyMenu) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access the Website Editor.</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<WebsiteBuilder mode="company" />} />
      <Route path="/:siteId" element={<SiteEditor mode="company" />} />
      <Route path="/:siteId" element={<div>Site Editor (Company Mode)</div>} />
    </Routes>
  )
}