import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import ErrorBoundary from '@/components/ErrorBoundary'
import { AuthProvider } from '@/contexts/AuthContext'
import { TenantProvider } from '@/contexts/TenantContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { MenuManagerProvider } from '@/contexts/MenuManagerContext'
import { logger } from '@/utils/logger'

import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages & Modules
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

import CRMProspecting from '@/modules/crm-prospecting/CRMProspecting'
import CRMSalesDeal from '@/modules/crm-sales-deal/CRMSalesDeal'
import InventoryManagement from '@/modules/inventory-management/InventoryManagement'
import LandManagement from '@/modules/land-management/LandManagement'
import QuoteBuilder from '@/modules/quote-builder/QuoteBuilder'
import { FinanceModule } from '@/modules/finance/FinanceModule'
import AgreementVault from '@/modules/agreement-vault/AgreementVault'
import ServiceOps from '@/modules/service-ops/ServiceOps'
import PDIChecklist from '@/modules/pdi-checklist/PDIChecklist'
import DeliveryTracker from '@/modules/delivery-tracker/DeliveryTracker'
import CommissionEngine from '@/modules/commission-engine/CommissionEngine'
import ClientPortalAdmin from '@/modules/client-portal/ClientPortalAdmin'
import ClientPortal from '@/modules/client-portal/ClientPortal'
import InvoicePayments from '@/modules/invoice-payments/InvoicePayments'
import CompanySettings from '@/modules/company-settings/CompanySettings'
import PlatformAdmin from '@/modules/platform-admin/PlatformAdmin'
import PlatformSettings from '@/modules/platform-admin/settings'
import ReportingSuite from '@/modules/reporting-suite/ReportingSuite'
import FinanceApplication from '@/modules/finance-application/FinanceApplication'
import { BrochureList, BrochureTemplateEditor, PublicBrochureView } from '@/modules/brochures'
import TaggingEngine from '@/modules/tagging-engine'
import TaskCenter from '@/modules/task-center/TaskCenter'
import CalendarScheduling from '@/modules/calendar-scheduling/CalendarScheduling'
import ContractorManagement from '@/modules/contractor-management/ContractorManagement'
import WarrantyMgmt from '@/modules/warranty-mgmt/index'
import { WebsiteBuilderRoutes, CompanyWebsiteRoutes } from '@/modules/website-builder'

// Property Listings (Admin + Public)
import PropertyListings from '@/modules/property-listings/PropertyListings'
import ListingDetail from '@/modules/property-listings/components/ListingDetail'
import { PublicCatalogView } from '@/modules/property-listings/components/PublicCatalogView'
import { PublicListingView } from '@/modules/property-listings/components/PublicListingView'
import PublicSitePreview from '@/components/PublicSitePreview'

// Add console logging to debug routing issues
console.log('App.tsx: Routes being configured')

logger.info('Application initializing', {
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: Date.now()
})

function App() {
  // simple pageview logger on navigation
  React.useEffect(() => {
    const handle = () => logger.pageView(window.location.pathname + window.location.search)
    window.addEventListener('popstate', handle)
    return () => window.removeEventListener('popstate', handle)
  }, [])

  return (
    <ErrorBoundary showErrorDetails={import.meta.env.DEV} onError={(e, info) => logger.error('Global error boundary', e, info)}>
      <ThemeProvider defaultTheme="light" storageKey="renter-insight-theme">
        <AuthProvider>
          <MenuManagerProvider>
            <Router>
              <TenantProvider>
                <div className="min-h-screen bg-background">
                  <ErrorBoundary>
                    <Routes>
                      {/* -------- PUBLIC SITE PREVIEW -------- */}
                      <Route path="/s/:siteSlug/*" element={<PublicSitePreview />} />
                      
                      {/* -------- PUBLIC (namespaced) -------- */}
                      <Route path="/public/:companySlug/listings" element={<PublicCatalogView />} />
                      <Route path="/public/:companySlug/l/:token" element={<PublicCatalogView />} />
                      <Route path="/public/:companySlug/listing/:listingId" element={<PublicListingView />} />

                      {/* -------- LOGIN -------- */}
                      <Route path="/login" element={<Login />} />

                      {/* -------- CLIENT PORTAL (separate app shell) -------- */}
                      <Route
                        path="/portalclient/*"
                        element={
                          <ProtectedRoute>
                            <ErrorBoundary>
                              <ClientPortal />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />

                      {/* -------- MAIN APP (protected, uses Layout) -------- */}
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <ErrorBoundary>
                                <Routes>
                                  {/* Home */}
                                  <Route path="/" element={<Dashboard />} />

                                  {/* Website Builder Routes */}
                                  <Route path="/platform/website-builder/*" element={<WebsiteBuilderRoutes />} />
                                  <Route path="/company/settings/website/*" element={<CompanyWebsiteRoutes />} />

                                  {/* CRM & Sales */}
                                  <Route path="/crm/*" element={<CRMProspecting />} />
                                  <Route path="/deals/*" element={<CRMSalesDeal />} />
                                  <Route path="/quotes/*" element={<QuoteBuilder />} />

                                  {/* Inventory & Ops - Order matters: specific routes before wildcards */}
                                  <Route path="/pdi/*" element={
                                    <ErrorBoundary>
                                      <PDIChecklist />
                                    </ErrorBoundary>
                                  } />
                                  <Route path="/inventory/warranty/*" element={
                                    <ErrorBoundary>
                                      <WarrantyMgmt />
                                    </ErrorBoundary>
                                  } />
                                  <Route path="/inventory/*" element={<InventoryManagement />} />
                                  <Route path="/land/*" element={<LandManagement />} />
                                  <Route path="/delivery/*" element={<DeliveryTracker />} />

                                  {/* Marketing → Property Listings (ADMIN) */}
                                  <Route path="/property/listings" element={<PropertyListings />} />
                                  <Route path="/property/listings/:listingId" element={<ListingDetail />} />
                                  <Route path="/brochures/*" element={
                                    <Routes>
                                      <Route path="/" element={<BrochureList />} />
                                      <Route path="/templates/new" element={<BrochureTemplateEditor />} />
                                      <Route path="/templates/:id/edit" element={<BrochureTemplateEditor />} />
                                    </Routes>
                                  } />

                                  {/* Finance & Agreements */}
                                  <Route path="/finance/*" element={<FinanceModule />} />
                                  <Route path="/agreements/*" element={<AgreementVault />} />
                                  <Route path="/invoices/*" element={<InvoicePayments />} />
                                  <Route path="/client-applications/*" element={<FinanceApplication />} />

                                  {/* Service & Support */}
                                  <Route path="/service/*" element={<ServiceOps />} />
                                  <Route path="/portal/*" element={<ClientPortalAdmin />} />

                                  {/* Management */}
                                  <Route path="/reports/*" element={<ReportingSuite />} />
                                  <Route path="/commissions/*" element={<CommissionEngine />} />
                                  <Route path="/tags/*" element={<TaggingEngine />} />
                                  <Route path="/tasks/*" element={<TaskCenter />} />
                                  <Route path="/calendar/*" element={<CalendarScheduling />} />
                                  <Route path="/contractors/*" element={<ContractorManagement />} />
                                  <Route path="/brochures/*" element={
                                    <Routes>
                                      <Route path="/" element={<BrochureList />} />
                                      <Route path="/templates/new" element={<BrochureTemplateEditor />} />
                                      <Route path="/templates/:id/edit" element={<BrochureTemplateEditor />} />
                                    </Routes>
                                  } />

                                  {/* Admin / Settings */}
                                  <Route path="/settings/*" element={<CompanySettings />} />
                                  <Route path="/admin/*" element={<PlatformAdmin />} />
                                  <Route path="/admin/settings/*" element={<PlatformSettings />} />

                                  {/* Fallback inside app */}
                                  <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                              </ErrorBoundary>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      {/* Public Brochure Routes - outside main layout */}
                      <Route path="/b/:publicId" element={<PublicBrochureView />} />

                      {/* -------- GLOBAL FALLBACK -------- */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ErrorBoundary>
                  <Toaster />
                </div>
              </TenantProvider>
            </Router>
          </MenuManagerProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App