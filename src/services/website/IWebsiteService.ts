import { Site, Page, Block, Media, Version, DomainConfig, PublishResult, Manufacturer, DemoInventoryItem, DemoLandHomePackage } from '@/modules/website-builder/types'

export interface IWebsiteService {
  // Sites
  getSites(): Promise<Site[]>
  getSite(id: string): Promise<Site | null>
  createSite(site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<Site>
  updateSite(id: string, updates: Partial<Site>): Promise<Site>
  deleteSite(id: string): Promise<void>

  // Pages
  getPages(siteId: string): Promise<Page[]>
  getPage(siteId: string, pageId: string): Promise<Page | null>
  createPage(siteId: string, page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page>
  updatePage(siteId: string, pageId: string, updates: Partial<Page>): Promise<Page>
  deletePage(siteId: string, pageId: string): Promise<void>
  reorderPages(siteId: string, pageIds: string[]): Promise<void>

  // Blocks
  getBlocks(siteId: string, pageId: string): Promise<Block[]>
  createBlock(siteId: string, pageId: string, block: Omit<Block, 'id'>): Promise<Block>
  updateBlock(siteId: string, pageId: string, blockId: string, updates: Partial<Block>): Promise<Block>
  deleteBlock(siteId: string, pageId: string, blockId: string): Promise<void>
  reorderBlocks(siteId: string, pageId: string, blockIds: string[]): Promise<void>

  // Media
  getMedia(siteId: string): Promise<Media[]>
  uploadMedia(siteId: string, file: File): Promise<Media>
  deleteMedia(siteId: string, mediaId: string): Promise<void>

  // Versions
  getVersions(siteId: string): Promise<Version[]>
  createVersion(siteId: string, name: string): Promise<Version>
  revertToVersion(siteId: string, versionId: string): Promise<Site>

  // Publishing
  publishSite(siteId: string): Promise<PublishResult>
  setDomain(siteId: string, domain: DomainConfig): Promise<{ success: boolean; message: string }>

  // External data
  getDefaultManufacturers(): Promise<Manufacturer[]>
  getDemoInventory(): Promise<DemoInventoryItem[]>
  getDemoLandHomePackages(): Promise<DemoLandHomePackage[]>
}