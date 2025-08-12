import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import ErrorBoundary from '@/components/ErrorBoundary'
import { AuthProvider } from '@/contexts/AuthContext'
import { TenantProvider } from '@/contexts/TenantContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { logger } from '@/utils/logger'
import { MenuManagerProvider } from '@/contexts/MenuManagerContext'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PlatformSettings from '@/modules/platform-admin/settings'
import ClientPortalLayout from '@/components/layout/ClientPortalLayout'
import WarrantyManagement from './modules/warranty-mgmt'

// Module imports
import CRMProspecting from '@/modules/crm-prospecting/CRMProspecting'
import InventoryManagement from '@/modules/inventory-management/InventoryManagement'
import QuoteBuilder from '@/modules/quote-builder/QuoteBuilder'
import { FinanceModule } from '@/modules/finance/FinanceModule'
import CRMSalesDeal from '@/modules/crm-sales-deal/CRMSalesDeal'

// Log app initialization
logger.info('Application initializing', {
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: Date.now()
});
import AgreementVault from '@/modules/agreement-vault/AgreementVault'
import ServiceOps from '@/modules/service-ops/ServiceOps'
import DeliveryTracker from '@/modules/delivery-tracker/DeliveryTracker'
import PDIChecklist from '@/modules/pdi-checklist/PDIChecklist'
import CommissionEngine from '@/modules/commission-engine/CommissionEngine'
import ClientPortalAdmin from '@/modules/client-portal/ClientPortalAdmin'
import ClientPortal from '@/modules/client-portal/ClientPortal'
import InvoicePayments from '@/modules/invoice-payments/InvoicePayments'
import CompanySettings from '@/modules/company-settings/CompanySettings'
import PlatformAdmin from '@/modules/platform-admin/PlatformAdmin'
import ReportingSuite from '@/modules/reporting-suite/ReportingSuite'
import FinanceApplication from '@/modules/finance-application/FinanceApplication'
import { PublicListingView } from '@/modules/property-listings/components/PublicListingView'
import { PublicListingView } from '@/modules/property-listings/components/PublicListingView'
import { PublicCatalogView } from '@/modules/property-listings/components/PublicCatalogView'
import PropertyListings from '@/modules/property-listings/PropertyListings'
import LandManagement from '@/modules/land-management/LandManagement'
import WarrantyMgmt from '@/modules/warranty-mgmt'
import TaggingEngine from '@/modules/tagging-engine'
import TaskCenter from '@/modules/task-center/TaskCenter'
import CalendarScheduling from '@/modules/calendar-scheduling/CalendarScheduling'
import ContractorManagement from '@/modules/contractor-management/ContractorManagement'

function App() {
  // Log page views
  React.useEffect(() => {
    const handlePopState = () => {
      logger.pageView(window.location.pathname + window.location.search);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ErrorBoundary 
      showErrorDetails={import.meta.env.DEV}
      onError={(error, errorInfo) => {
        logger.error('Global error boundary triggered', error, errorInfo);
      }}
    >
      <ThemeProvider defaultTheme="light" storageKey="renter-insight-theme">
        <AuthProvider>
          <MenuManagerProvider>
            <Router>
              <TenantProvider>
                <div className="min-h-screen bg-background">
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      {/* Public Routes - No authentication required */}
                      <Route path="/:companySlug/listing/:listingId" element={<PublicListingView />} />
                      <Route path="/:companySlug/listings" element={<PublicCatalogView />} />
                      <Route path="/:companySlug/l/:token" element={<PublicCatalogView />} />
                      {/* Client Portal Routes - these will render ClientPortal directly */}
                      <Route path="/portalclient/*" element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <ClientPortal />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } />
                      {/* Public Pages Routes */}
                      <Route path="/:companySlug/listing/:listingId" element={
                        <ErrorBoundary>
                          <PublicListingView />
                        </ErrorBoundary>
                      } />
                      <Route path="/:companySlug/listings" element={
                        <ErrorBoundary>
                          <PublicCatalogView />
                        </ErrorBoundary>
                      } />
                      <Route path="/:companySlug/l/:token" element={
                        <ErrorBoundary>
                          <PublicCatalogView />
                        </ErrorBoundary>
                      } />
                      {/* Main Application Routes - these will render the Layout */}
                      <Route path="/*" element={
                        <ProtectedRoute>
                          <Layout>
                            <ErrorBoundary>
                              <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/crm/*" element={<CRMProspecting />} />
                                <Route path="/inventory/*" element={<InventoryManagement />} />
                                <Route path="/deals/*" element={<CRMSalesDeal />} />
                                <Route path="/finance/*" element={<FinanceModule />} />
                                <Route path="/quotes/*" element={<QuoteBuilder />} />
                                <Route path="/agreements/*" element={<AgreementVault />} />
                                <Route path="/service/*" element={<ServiceOps />} />
                                <Route path="/pdi/*" element={<PDIChecklist />} />
                                <Route path="/delivery/*" element={<DeliveryTracker />} />
                                <Route path="/commissions/*" element={<CommissionEngine />} />
                                <Route path="/portal/*" element={<ClientPortalAdmin />} />
                                <Route path="/invoices/*" element={<InvoicePayments />} />
                                <Route path="/settings/*" element={<CompanySettings />} />
                                <Route path="/admin/*" element={<PlatformAdmin />} />
                                <Route path="/admin/settings/*" element={<PlatformSettings />} />
                                <Route path="/reports/*" element={<ReportingSuite />} />
                                <Route path="/client-applications/*" element={<FinanceApplication />} />
                                <Route path="/listings/*" element={<PropertyListings />} />
                              </Routes>
                            </ErrorBoundary>
                          </Layout>
                        </ProtectedRoute>
                        <Route path="/listings/:listingId" element={<PublicListingView />} />
                      } />
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
  );
}

export default App