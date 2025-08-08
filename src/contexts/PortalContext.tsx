import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import { MockUser } from '@/mocks/usersMock'

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

export const PortalProvider: React.FC<
  React.PropsWithChildren<{ value?: PortalContextValue; impersonatedUser?: any; fallbackUser?: any }>
> = ({ value, impersonatedUser, fallbackUser, children }) => {
  const { user } = useAuth()
  
  // If value is provided directly, use it
  if (value) {
    return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  }
  
  // Otherwise, use the existing logic
  const currentUser = impersonatedUser || fallbackUser || user
  const isProxying = !!impersonatedUser
  
  const getDisplayName = () => currentUser?.name || 'Unknown User'
  const getDisplayEmail = () => currentUser?.email || 'unknown@example.com'
  const getCustomerId = () => currentUser?.id || 'unknown'
  
  const contextValue: PortalContextValue = {
    client: currentUser,
    impersonateClientId: impersonatedUser?.id || null,
    refresh: () => {},
    getDisplayName,
    getDisplayEmail,
    getCustomerId,
    isProxying,
    proxiedClient: impersonatedUser
  }
  
  return <PortalContext.Provider value={contextValue}>{children}</PortalContext.Provider>
}
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