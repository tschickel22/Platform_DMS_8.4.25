import React from 'react'
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { PortalProvider } from '@/contexts/PortalContext'
import { mockUsers } from '@/mocks/usersMock'
import ClientPortal from '@/ClientPortal'
import { ClientLoansView } from './components/ClientLoansView'
import { ClientAgreements } from './components/ClientAgreements'
import { PortalApplicationView } from '@/modules/finance-application/components/PortalApplicationView'
import { ClientServiceTickets } from './components/ClientServiceTickets'
import { ClientSettings } from './components/ClientSettings'

function ClientPortalContent() {
  return (
    <Routes>
      <Route path="/" element={<div>Portal Dashboard</div>} />
      <Route path="/loans" element={<ClientLoansView />} />
      <Route path="/agreements" element={<ClientAgreements />} />
      <Route path="/finance-applications" element={<PortalApplicationView />} />
      <Route path="/service-tickets" element={<ClientServiceTickets />} />
      <Route path="/settings" element={<ClientSettings />} />
      <Route path="*" element={<Navigate to="/portalclient/" replace />} />
    </Routes>
  )
}

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
        <ClientPortalContent />
      </ClientPortal>
    </PortalProvider>
  )
}