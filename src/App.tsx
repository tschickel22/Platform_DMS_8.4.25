import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ErrorBoundary from '@/components/ErrorBoundary'
import { AuthProvider } from '@/contexts/AuthContext'
import { TenantProvider } from '@/contexts/TenantContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { MenuManagerProvider } from '@/contexts/MenuManagerContext'
import { logger } from '@/utils/logger'

import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages & Modules
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

import CRMProspecting from '@/modules/crm-prospecting/CRMProspecting'

// Add console logging to debug routing issues
console.log('App.tsx: Routes being configured')

logger.info('Application initializing', {
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: Date.now()
})

// Simple Layout component for basic structure
function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background p-6">
      {children}
    </div>
  )
}

function App() {
  // simple pageview logger on navigation
  React.useEffect(() => {
    const handle = () => logger.pageView(window.location.pathname + window.location.search)
    window.addEventListener('popstate', handle)
    return () => window.removeEventListener('popstate', handle)
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="renter-insight-theme">
        <AuthProvider>
          <MenuManagerProvider>
            <Router>
              <TenantProvider>
                <div className="min-h-screen bg-background">
                  <ErrorBoundary>
                    <Routes>
                      {/* -------- LOGIN -------- */}
                      <Route path="/login" element={<Login />} />

                      {/* -------- MAIN APP (protected, uses Layout) -------- */}
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <SimpleLayout>
                              <ErrorBoundary>
                                <Routes>
                                  {/* Home */}
                                  <Route path="/" element={<Dashboard />} />

                                  {/* CRM & Sales */}
                                  <Route path="/crm/*" element={<CRMProspecting />} />

                                  {/* Fallback inside app */}
                                  <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                              </ErrorBoundary>
                            </SimpleLayout>
                          </ProtectedRoute>
                        }
                      />

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