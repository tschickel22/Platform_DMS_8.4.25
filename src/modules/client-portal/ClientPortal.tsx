import React from 'react'
import { Routes, Route, useSearchParams, Navigate } from 'react-router-dom'
import { PortalProvider } from '@/contexts/PortalContext'
import { mockUsers } from '@/mocks/usersMock'
import ClientPortal from '@/ClientPortal'
import { ClientLoansView } from './components/ClientLoansView'
import { ClientAgreements } from './components/ClientAgreements'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientServiceTickets } from './components/ClientServiceTickets'
import { ClientSettings } from './components/ClientSettings'

export default function ClientPortalRoutes() {
  const [searchParams] = useSearchParams()
  const impersonateClientId = searchParams.get('impersonateClientId')
  
  // Find the impersonated user from mock data
  const impersonatedUser = impersonateClientId 
    ? mockUsers.sampleUsers.find(u => u.id === impersonateClientId) 
    : null

  return (
    <PortalProvider 
      impersonatedUser={impersonatedUser}
      fallbackUser={impersonatedUser ?? null}
    >
      <ClientPortal>
        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Welcome to your portal</h1>
                <p className="text-muted-foreground">
                  Access your account information and services
                </p>
              </div>
            </div>
          } />
          <Route path="/loans" element={<ClientLoansView />} />
          <Route path="/agreements" element={<ClientAgreements />} />
          <Route path="/finance-applications" element={<PortalApplicationView />} />
          <Route path="/service-tickets" element={<ClientServiceTickets />} />
          <Route path="/settings" element={<ClientSettings />} />
          <Route path="*" element={<Navigate to="/portalclient/" replace />} />
        </Routes>
      </ClientPortal>
    </PortalProvider>
  )
}