import { IWebsiteService } from './IWebsiteService'
import { LocalWebsiteService } from './local/LocalWebsiteService'
import { RailsWebsiteService } from './rails/RailsWebsiteService'

// Factory function to choose service implementation
export function createWebsiteService(): IWebsiteService {
  const useRails = import.meta.env.VITE_USE_RAILS_API === 'true'
  
  if (useRails) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    return new RailsWebsiteService(apiBase)
  }
  
  return new LocalWebsiteService()
}

// Singleton instance
export const websiteService = createWebsiteService()