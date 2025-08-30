// src/utils/apiClient.ts
// Robust API client for Netlify Functions (with env override + graceful parsing)
import { toast } from '@/hooks/use-toast'
import { logger, measurePerformance } from '@/utils/logger';

// Allow override via env for local/prod differences.
// e.g. VITE_FUNCTIONS_BASE="http://localhost:8888/.netlify/functions"
const API_BASE: string =
  (import.meta as any)?.env?.VITE_FUNCTIONS_BASE ||
  '/.netlify/functions'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
  status?: number
}

function isAbsolute(url: string) {
  return /^https?:\/\//i.test(url)
}

export class ApiClient {
  private buildUrl(endpoint: string) {
    if (isAbsolute(endpoint)) return endpoint
    return `${API_BASE}${endpoint}`
  }

  private async parseResponse(res: Response) {
    const contentType = res.headers.get('content-type') || ''

    // Prefer JSON
    if (contentType.includes('application/json')) {
      try {
        return { ok: true, body: await res.json(), contentType }
      } catch {
        // fall through to text
      }
    }

    // Fallback to text (commonly HTML when route is wrong)
    const text = await res.text()

    // If it *looks* like JSON, try to parse once more
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        return { ok: true, body: JSON.parse(text), contentType: 'application/json' }
      } catch {
        /* ignore */
      }
    }

    return { ok: false, body: text, contentType: contentType || 'text/plain' }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint)

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      })

      const { ok, body, contentType } = await this.parseResponse(res)

      if (!res.ok) {
        // Server responded with an error status
        const message =
          (ok && (body?.error || body?.message)) ||
          `HTTP ${res.status} ${res.statusText}`
        return { success: false, error: message, status: res.status }
      }

      if (!ok) {
        // Likely hitting index.html (HTML) due to a bad route / missing functions
        const preview =
          typeof body === 'string' ? body.slice(0, 180) : '[non-text body]'
        return {
          success: false,
          error: `Expected JSON but got ${contentType}. Check your functions base/route. Body preview: ${preview}`,
          status: res.status,
        }
      }

      return { data: body as T, success: true, status: res.status }
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err)
      // Network-level failure
      toast({
        title: 'Connection Error',
        description:
          'Unable to connect to server. Please verify your functions server is running.',
        variant: 'destructive',
      })
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown network error',
      }
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(this.buildUrl('/ping'))
      return res.ok
    } catch (e) {
      console.error('Health check failed:', e)
      return false
    }
  }

  // Listings CRUD
  listingsCrud = {
    getListings: async (companyId: string) => {
      const res = await this.get<any>(
        `/listings-crud?companyId=${encodeURIComponent(companyId)}`
      )
      if (!res.success) {
        throw new Error(
          res.error ||
            'Failed to fetch listings (is your Netlify Functions server running and returning JSON?)'
        )
      }
      return res.data
    },

    getListing: async (companyId: string, listingId: string) => {
      const res = await this.get<any>(
        `/listings-crud?companyId=${encodeURIComponent(
          companyId
        )}&listingId=${encodeURIComponent(listingId)}`
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

    updateListing: async (
      companyId: string,
      listingId: string,
      updates: any
    ) => {
      const res = await this.put<any>(
        `/listings-crud?companyId=${encodeURIComponent(
          companyId
        )}&listingId=${encodeURIComponent(listingId)}`,
        updates
      )
      if (!res.success) throw new Error(res.error || 'Failed to update listing')
      return res.data
    },

    deleteListing: async (companyId: string, listingId: string) => {
      const res = await this.delete<any>(
        `/listings-crud?companyId=${encodeURIComponent(
          companyId
        )}&listingId=${encodeURIComponent(listingId)}`
      )
      if (!res.success) throw new Error(res.error || 'Failed to delete listing')
      return res.data
    },
  }
}

export const apiClient = new ApiClient()
export default apiClient