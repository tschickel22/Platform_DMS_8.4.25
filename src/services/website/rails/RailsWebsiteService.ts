import { IWebsiteService } from '../IWebsiteService'
import { Site, Page, Block, Media, Version, DomainConfig, PublishResult, Manufacturer, DemoInventoryItem, DemoLandHomePackage } from '@/modules/website-builder/types'

export class RailsWebsiteService implements IWebsiteService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Sites
  async getSites(): Promise<Site[]> {
    return this.request<Site[]>('/websites/sites')
  }

  async getSite(id: string): Promise<Site | null> {
    try {
      return await this.request<Site>(`/websites/sites/${id}`)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async createSite(site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<Site> {
    return this.request<Site>('/websites/sites', {
      method: 'POST',
      body: JSON.stringify({ site })
    })
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site> {
    return this.request<Site>(`/websites/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ site: updates })
    })
  }

  async deleteSite(id: string): Promise<void> {
    await this.request(`/websites/sites/${id}`, { method: 'DELETE' })
  }

  // Pages
  async getPages(siteId: string): Promise<Page[]> {
    return this.request<Page[]>(`/websites/sites/${siteId}/pages`)
  }

  async getPage(siteId: string, pageId: string): Promise<Page | null> {
    try {
      return await this.request<Page>(`/websites/sites/${siteId}/pages/${pageId}`)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async createPage(siteId: string, page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    return this.request<Page>(`/websites/sites/${siteId}/pages`, {
      method: 'POST',
      body: JSON.stringify({ page })
    })
  }

  async updatePage(siteId: string, pageId: string, updates: Partial<Page>): Promise<Page> {
    return this.request<Page>(`/websites/sites/${siteId}/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify({ page: updates })
    })
  }

  async deletePage(siteId: string, pageId: string): Promise<void> {
    await this.request(`/websites/sites/${siteId}/pages/${pageId}`, { method: 'DELETE' })
  }

  async reorderPages(siteId: string, pageIds: string[]): Promise<void> {
    await this.request(`/websites/sites/${siteId}/pages/reorder`, {
      method: 'POST',
      body: JSON.stringify({ pageIds })
    })
  }

  // Blocks
  async getBlocks(siteId: string, pageId: string): Promise<Block[]> {
    return this.request<Block[]>(`/websites/sites/${siteId}/pages/${pageId}/blocks`)
  }

  async createBlock(siteId: string, pageId: string, block: Omit<Block, 'id'>): Promise<Block> {
    return this.request<Block>(`/websites/sites/${siteId}/pages/${pageId}/blocks`, {
      method: 'POST',
      body: JSON.stringify({ block })
    })
  }

  async updateBlock(siteId: string, pageId: string, blockId: string, updates: Partial<Block>): Promise<Block> {
    return this.request<Block>(`/websites/sites/${siteId}/pages/${pageId}/blocks/${blockId}`, {
      method: 'PUT',
      body: JSON.stringify({ block: updates })
    })
  }

  async deleteBlock(siteId: string, pageId: string, blockId: string): Promise<void> {
    await this.request(`/websites/sites/${siteId}/pages/${pageId}/blocks/${blockId}`, { method: 'DELETE' })
  }

  async reorderBlocks(siteId: string, pageId: string, blockIds: string[]): Promise<void> {
    await this.request(`/websites/sites/${siteId}/pages/${pageId}/blocks/reorder`, {
      method: 'POST',
      body: JSON.stringify({ blockIds })
    })
  }

  // Media
  async getMedia(siteId: string): Promise<Media[]> {
    return this.request<Media[]>(`/websites/sites/${siteId}/media`)
  }

  async uploadMedia(siteId: string, file: File): Promise<Media> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${this.baseUrl}/websites/sites/${siteId}/media`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }
    
    return response.json()
  }

  async deleteMedia(siteId: string, mediaId: string): Promise<void> {
    await this.request(`/websites/sites/${siteId}/media/${mediaId}`, { method: 'DELETE' })
  }

  // Versions
  async getVersions(siteId: string): Promise<Version[]> {
    return this.request<Version[]>(`/websites/sites/${siteId}/versions`)
  }

  async createVersion(siteId: string, name: string): Promise<Version> {
    return this.request<Version>(`/websites/sites/${siteId}/versions`, {
      method: 'POST',
      body: JSON.stringify({ name })
    })
  }

  async revertToVersion(siteId: string, versionId: string): Promise<Site> {
    return this.request<Site>(`/websites/sites/${siteId}/versions/${versionId}/revert`, {
      method: 'POST'
    })
  }

  // Publishing
  async publishSite(siteId: string): Promise<PublishResult> {
    return this.request<PublishResult>(`/websites/sites/${siteId}/publish`, {
      method: 'POST'
    })
  }

  async setDomain(siteId: string, domain: DomainConfig): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/websites/sites/${siteId}/domain`, {
      method: 'POST',
      body: JSON.stringify({ domain })
    })
  }

  // External data
  async getDefaultManufacturers(): Promise<Manufacturer[]> {
    return this.request<Manufacturer[]>('/websites/manufacturers/defaults')
  }

  async getDemoInventory(): Promise<DemoInventoryItem[]> {
    return this.request<DemoInventoryItem[]>('/websites/demo/inventory')
  }

  async getDemoLandHomePackages(): Promise<DemoLandHomePackage[]> {
    return this.request<DemoLandHomePackage[]>('/websites/demo/landhome')
  }
}