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

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`)
      }

      const data = await response.json()
      return { data, success: true }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      
      // Handle non-200 status codes
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Netlify function not found: ${endpoint}`)
          this.toast({
            title: "Service Unavailable",
            description: "This feature is not yet available. Please try again later.",
            variant: "default",
          })
          return null
        }
        
        if (response.status === 403) {
          console.warn(`Access denied to function: ${endpoint}`)
          this.toast({
            title: "Access Denied",
            description: "You don't have permission to access this resource.",
            variant: "destructive",
          })
          return null
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
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
  async healthCheck(): Promise<boolean> {
    try {
      // Only show toast for unexpected errors (network issues, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.toast({
          title: "Connection Error",
          description: "Unable to connect to server. Please check your connection.",
          variant: "destructive",
        })
      }
      console.error('Health check failed:', error)
      console.error(`API Error (${endpoint}):`, error)
      return false
    } catch (error) {
      return false
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient