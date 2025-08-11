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
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { data, success: true }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      
      // Show user-friendly toast notification
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to server. Please try again.',
        variant: 'destructive',
      })

      return { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
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

  // Health check function
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/ping`)
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient