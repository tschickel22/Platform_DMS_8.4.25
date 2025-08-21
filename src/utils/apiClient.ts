// API client for Bolt environment - simplified for local development
import { toast } from '@/hooks/use-toast'
import { logger, measurePerformance } from '@/utils/logger';

interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
  status?: number
}

export class ApiClient {
  private baseUrl: string
  
  constructor() {
    // In Bolt environment, we use relative URLs or local storage
    this.baseUrl = ''
  }
  
  // Health check for Bolt environment
  async ping(): Promise<boolean> {
    // Always healthy in Bolt since everything is local
    return true
  }
  
  // Simplified methods that work with local storage through service layer
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      logger.debug(`Local API GET: ${endpoint}`)
      // All actual data comes from service layer using localStorage
      return { success: true, data: {} as T, status: 200 }
    } catch (error) {
      logger.error(`Local API GET error: ${endpoint}`, error)
      return { success: false, error: 'Local storage error', status: 500 }
    }
  }
  
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      logger.debug(`Local API POST: ${endpoint}`, { body })
      // All actual data operations go through service layer
      return { success: true, data: {} as T, status: 201 }
    } catch (error) {
      logger.error(`Local API POST error: ${endpoint}`, error)
      return { success: false, error: 'Local storage error', status: 500 }
    }
  }
  
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      logger.debug(`Local API PUT: ${endpoint}`, { body })
      return { success: true, data: {} as T, status: 200 }
    } catch (error) {
      logger.error(`Local API PUT error: ${endpoint}`, error)
      return { success: false, error: 'Local storage error', status: 500 }
    }
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      logger.debug(`Local API DELETE: ${endpoint}`)
      return { success: true, data: {} as T, status: 200 }
    } catch (error) {
      logger.error(`Local API DELETE error: ${endpoint}`, error)
      return { success: false, error: 'Local storage error', status: 500 }
    }
  }
  
  // Utility method for handling file uploads in Bolt
  async uploadFile(file: File, endpoint: string): Promise<ApiResponse<{ url: string }>> {
    try {
      // Convert to base64 for local storage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      logger.debug(`File upload to ${endpoint}`, { fileName: file.name, size: file.size })
      
      return { 
        success: true, 
        data: { url: base64 }, 
        status: 200 
      }
    } catch (error) {
      logger.error(`File upload error: ${endpoint}`, error)
      return { success: false, error: 'File upload failed', status: 500 }
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient