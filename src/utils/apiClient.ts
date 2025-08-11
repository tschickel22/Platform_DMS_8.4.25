// src/utils/apiClient.ts
// API Client utility for handling Netlify Functions with graceful fallbacks
import { toast } from '@/hooks/use-toast'

const API_BASE = '/.netlify/functions'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`)
      }

      const data = await response.json()
      return { data, success: true }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)

      // User-friendly toast
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to server. Please try again.',
        variant: 'destructive',
      })

      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/ping`)
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }

  // Listings CRUD (fixed: valid class field, uses API_BASE, and common request helper)
  listingsCrud = {
    getListings: async (companyId: string) => {
      const res = await this.get<any>(`/listings-crud?companyId=${encodeURIComponent(companyId)}`)
      if (!res.success) throw new Error(res.error || 'Failed to fetch listings')
      return res.data
    },

    getListing: async (companyId: string, listingId: string) => {
      const res = await this.get<any>(
        `/listings-crud?companyId=${encodeURIComponent(companyId)}&listingId=${encodeURIComponent(listingId)}`
      )
      if (!res.success) throw new Error(res.error || 'Failed to fetch listing')
      return res.data
    },

    createListing: async (companyId: string, listingData: any) => {
      const res = await this.post<any>(
        `/listings-crud?companyId=${encodeURIComponent(companyId)}`,
        listingData
      )
      if (!res.success) throw new Error(res.error || 'Failed to create listing')
      return res.data
    },

    updateListing: async (companyId: string, listingId: string, updates: any) => {
      const res = await this.put<any>(
        `/listings-crud?companyId=${encodeURIComponent(companyId)}&listingId=${encodeURIComponent(listingId)}`,
        updates
      )
      if (!res.success) throw new Error(res.error || 'Failed to update listing')
      return res.data
    },

    deleteListing: async (companyId: string, listingId: string) => {
      const res = await this.delete<any>(
        `/listings-crud?companyId=${encodeURIComponent(companyId)}&listingId=${encodeURIComponent(listingId)}`
      )
      if (!res.success) throw new Error(res.error || 'Failed to delete listing')
      return res.data
    },
  }
}

export const apiClient = new ApiClient()
export default apiClient
