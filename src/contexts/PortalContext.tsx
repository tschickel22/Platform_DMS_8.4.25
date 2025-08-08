import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import { MockUser } from '@/mocks/usersMock'
import { useAuth } from '@/hooks/useAuth'

interface PortalClient {
  id: string
  name: string
  email: string
}

export type PortalContextValue = {
  client: any | null
  impersonateClientId?: string | null
  refresh?: () => void
  getDisplayName: () => string
  getDisplayEmail: () => string
  getCustomerId: () => string
  isProxying: boolean
  proxiedClient: any | null
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function usePortal() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}

interface PortalProviderProps {
  children: ReactNode
  impersonatedUser?: MockUser | null
  fallbackUser?: {
    name: string
    email: string
  }
}

export function PortalProvider({ children, impersonatedUser, fallbackUser }: PortalProviderProps) {
  // Convert impersonated user to proxied client format
  const proxiedClient = impersonatedUser 
    ? {
        id: impersonatedUser.id,
        name: impersonatedUser.name,
        email: impersonatedUser.email
      }
    : null

  const isProxying = !!proxiedClient

  // Add useEffect for logging what PortalProvider receives
  useEffect(() => {
    console.log('PortalProvider rendered/re-rendered.')
    console.log('Received impersonatedUser prop:', impersonatedUser)
    console.log('Calculated proxiedClient:', proxiedClient)
    console.log('Is proxying:', isProxying)
  }, [impersonatedUser, proxiedClient, isProxying]) // Dependencies
  const getDisplayName = (): string => {
    if (proxiedClient) {
      return proxiedClient.name
    }
    return fallbackUser?.name || 'User'
  }

  const getDisplayEmail = (): string => {
    if (proxiedClient) {
      return proxiedClient.email
    }
    return fallbackUser?.email || ''
  }

  const getCustomerId = (): string => {
    if (proxiedClient) {
      return proxiedClient.id
    }
    // Return a default customer ID when not proxying
    return 'portal-customer-001'
  }

  const value = {
    client: proxiedClient,
    impersonateClientId: proxiedClient?.id || null,
    refresh: () => {},
    proxiedClient,
    isProxying,
    getDisplayName,
    getDisplayEmail,
    getCustomerId
  }

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  )
}