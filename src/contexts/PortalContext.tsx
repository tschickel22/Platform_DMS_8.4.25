import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface User {
  id: string
  email: string
  name: string
  role: string
  tenantId?: string
}

interface PortalContextType {
  getDisplayName: () => string
  getDisplayEmail: () => string
  getCustomerId: () => string
  isProxying: boolean
  proxiedClient: User | null
}

const PortalContext = createContext<PortalContextType | undefined>(undefined)

export function usePortal() {
  const context = useContext(PortalContext)
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}

interface PortalProviderProps {
  children: ReactNode
  impersonatedUser?: User | null
  fallbackUser?: User | null
}

export function PortalProvider({ children, impersonatedUser, fallbackUser }: PortalProviderProps) {
  const { user: authUser } = useAuth()
  
  // Determine which user to display
  const displayUser = impersonatedUser || fallbackUser || authUser
  const isProxying = !!impersonatedUser
  
  const getDisplayName = () => {
    return displayUser?.name || 'Guest User'
  }
  
  const getDisplayEmail = () => {
    return displayUser?.email || 'guest@example.com'
  }
  
  const getCustomerId = () => {
    return displayUser?.id || 'guest-id'
  }

  const value: PortalContextType = {
    getDisplayName,
    getDisplayEmail,
    getCustomerId,
    isProxying,
    proxiedClient: impersonatedUser
  }

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  )
}