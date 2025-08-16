import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { computeWebsiteBuilderCaps } from '@/shared/featureFlags'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import WebsiteBuilderErrorBoundary from './guard/ErrorBoundary'
import { WebsiteBuilderShell } from './WebsiteBuilderShell'
import { WebsiteBuilder } from './WebsiteBuilder'

export function WebsiteBuilderRoutes() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  
  const roles = user?.role ? [user.role] : []
  const companyId = tenant?.id || null
  const caps = computeWebsiteBuilderCaps({ roles, companyId })

  if (!caps.visibleInPlatformMenu) {
    return <Navigate to="/" replace />
  }

  return (
    <WebsiteBuilderErrorBoundary>
      <Routes>
        <Route path="/" element={<WebsiteBuilderShell mode="platform" />} />
        <Route path="/:siteId" element={<WebsiteBuilder mode="platform" />} />
        <Route path="*" element={<Navigate to="/platform/website-builder" replace />} />
      </Routes>
    </WebsiteBuilderErrorBoundary>
  )
}

export function CompanyWebsiteRoutes() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  
  const roles = user?.role ? [user.role] : []
  const companyId = tenant?.id || null
  const caps = computeWebsiteBuilderCaps({ roles, companyId })

  if (!caps.visibleInCompanyMenu) {
    return <Navigate to="/" replace />
  }

  return (
    <WebsiteBuilderErrorBoundary>
      <Routes>
        <Route path="/" element={<WebsiteBuilderShell mode="company" />} />
        <Route path="/:siteId" element={<WebsiteBuilder mode="company" />} />
        <Route path="*" element={<Navigate to="/company/settings/website" replace />} />
      </Routes>
    </WebsiteBuilderErrorBoundary>
  )
}