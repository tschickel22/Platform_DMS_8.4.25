import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PortalProvider } from '@/contexts/PortalContext'
import { mockUsers } from '@/mocks/usersMock'
import ClientPortalLayout from '@/components/layout/ClientPortalLayout'

export default function ClientPortal() {
  return (
    <Routes>
      <Route path="/*" element={<ClientPortalLayout />} />
    </Routes>
  )
}