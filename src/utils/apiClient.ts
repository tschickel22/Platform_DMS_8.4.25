// src/utils/apiClient.ts
// API client for Bolt environment - uses local storage for data persistence
import { toast } from '@/hooks/use-toast'
import { logger, measurePerformance } from '@/utils/logger';

interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
  status?: number
}

export class ApiClient {
  // Simplified API client for Bolt environment
  // All data operations now use local storage through service layer
  
  // Health check for local environment
  async ping(): Promise<boolean> {
    // In Bolt environment, we're always "healthy" since everything is local
    return true
  }
  
  // Placeholder methods for future backend integration
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    logger.debug(`API GET request to ${endpoint} - using local storage`)
    return { success: true, data: {} as T }
  }
  
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    logger.debug(`API POST request to ${endpoint} - using local storage`)
    return { success: true, data: {} as T }
  }
  
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    logger.debug(`API PUT request to ${endpoint} - using local storage`)
    return { success: true, data: {} as T }
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    logger.debug(`API DELETE request to ${endpoint} - using local storage`)
    return { success: true, data: {} as T }
  }
}

export const apiClient = new ApiClient()
export default apiClient