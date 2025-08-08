import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Tenant {
  id: string
  name: string
  domain: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  settings?: Record<string, any>
}

interface TenantContextType {
  tenant: Tenant | null
  isLoading: boolean
  updateTenant: (updates: Partial<Tenant>) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTenant = async () => {
      try {
        if (isAuthenticated && user?.tenantId) {
          // Mock tenant data - replace with real API call
          const mockTenant: Tenant = {
            id: user.tenantId,
            name: 'Renter Insight CRM',
            domain: 'renterinsight.com',
            logo: '/image.png',
            primaryColor: '#3b82f6',
            secondaryColor: '#1e40af',
            settings: {
              allowClientPortal: true,
              enableNotifications: true,
              timezone: 'America/New_York'
            }
          }
          
          setTenant(mockTenant)
        } else {
          setTenant(null)
        }
      } catch (error) {
        console.error('Failed to load tenant:', error)
        setTenant(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadTenant()
  }, [isAuthenticated, user])

  const updateTenant = (updates: Partial<Tenant>) => {
    if (tenant) {
      setTenant({ ...tenant, ...updates })
    }
  }

  const value: TenantContextType = {
    tenant,
    isLoading,
    updateTenant
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}