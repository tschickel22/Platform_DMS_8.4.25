import { IWebsiteService } from '../IWebsiteService'
import { Site, Page, Block, Media, Version, DomainConfig, PublishResult, Manufacturer, DemoInventoryItem, DemoLandHomePackage } from '@/modules/website-builder/types'
import { generateId } from '@/lib/utils'

export class LocalWebsiteService implements IWebsiteService {
  private getStorageKey(key: string): string {
    return `wb2:${key}`
  }

  private async delay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(this.getStorageKey(key))
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.warn(`Failed to load ${key}:`, error)
      return defaultValue
    }
  }

  private setToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to save ${key}:`, error)
    }
  }

  // Sites
  async getSites(): Promise<Site[]> {
    await this.delay()
    return this.getFromStorage('sites', [])
  }

  async getSite(id: string): Promise<Site | null> {
    await this.delay()
    const sites = await this.getSites()
    return sites.find(site => site.id === id) || null
  }

  async createSite(siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<Site> {
    await this.delay()
    const sites = await this.getSites()
    
    // Normalize pages/blocks to guarantee stable IDs for editor + page list
    const pagesWithIds = (siteData.pages || []).map((p: any, idx: number) => ({
      id: p.id || `page-${idx}`,
      title: p.title,
      path: p.path,
      order: p.order || idx,
      seo: p.seo,
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
      blocks: (p.blocks || []).map((b: any, i: number) => ({ 
        id: b.id || `block-${i}`, 
        type: b.type || 'text',
        order: b.order || i,
        content: b.content || {},
        ...b 
      }))
    }))

    const newSite: Site = {
      ...siteData,
      id: generateId(),
      pages: pagesWithIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    sites.push(newSite)
    this.setToStorage('sites', sites)
    
    return newSite
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site> {
    await this.delay()
    const sites = await this.getSites()
    const index = sites.findIndex(site => site.id === id)
    
    if (index === -1) {
      throw new Error('Site not found')
    }
    
    const updatedSite = {
      ...sites[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    sites[index] = updatedSite
    this.setToStorage('sites', sites)
    
    return updatedSite
  }

  async deleteSite(id: string): Promise<void> {
    await this.delay()
    const sites = await this.getSites()
    const filtered = sites.filter(site => site.id !== id)
    this.setToStorage('sites', filtered)
  }

  // Pages
  async getPages(siteId: string): Promise<Page[]> {
    await this.delay()
    const site = await this.getSite(siteId)
    return site?.pages || []
  }

  async getPage(siteId: string, pageId: string): Promise<Page | null> {
    await this.delay()
    const pages = await this.getPages(siteId)
    return pages.find(page => page.id === pageId) || null
  }

  async createPage(siteId: string, pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    await this.delay()
    const site = await this.getSite(siteId)
    if (!site) throw new Error('Site not found')
    
    const newPage: Page = {
      ...pageData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    site.pages.push(newPage)
    await this.updateSite(siteId, { pages: site.pages })
    
    return newPage
  }

  async updatePage(siteId: string, pageId: string, updates: Partial<Page>): Promise<Page> {
    await this.delay()
    const site = await this.getSite(siteId)
    if (!site) throw new Error('Site not found')
    
    const pageIndex = site.pages.findIndex(page => page.id === pageId)
    if (pageIndex === -1) throw new Error('Page not found')
    
    const updatedPage = {
      ...site.pages[pageIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    site.pages[pageIndex] = updatedPage
    await this.updateSite(siteId, { pages: site.pages })
    
    return updatedPage
  }

  async deletePage(siteId: string, pageId: string): Promise<void> {
    await this.delay()
    const site = await this.getSite(siteId)
    if (!site) throw new Error('Site not found')
    
    const filteredPages = site.pages.filter(page => page.id !== pageId)
    await this.updateSite(siteId, { pages: filteredPages })
  }

  async reorderPages(siteId: string, pageIds: string[]): Promise<void> {
    await this.delay()
    const site = await this.getSite(siteId)
    if (!site) throw new Error('Site not found')
    
    const reorderedPages = pageIds.map((id, index) => {
      const page = site.pages.find(p => p.id === id)
      if (!page) throw new Error(`Page ${id} not found`)
      return { ...page, order: index }
    })
    
    await this.updateSite(siteId, { pages: reorderedPages })
  }

  // Blocks
  async getBlocks(siteId: string, pageId: string): Promise<Block[]> {
    await this.delay()
    const page = await this.getPage(siteId, pageId)
    return page?.blocks || []
  }

  async createBlock(siteId: string, pageId: string, blockData: Omit<Block, 'id'>): Promise<Block> {
    await this.delay()
    const page = await this.getPage(siteId, pageId)
    if (!page) throw new Error('Page not found')
    
    const newBlock: Block = {
      ...blockData,
      id: generateId()
    }
    
    page.blocks.push(newBlock)
    await this.updatePage(siteId, pageId, { blocks: page.blocks })
    
    return newBlock
  }

  async updateBlock(siteId: string, pageId: string, blockId: string, updates: Partial<Block>): Promise<Block> {
    await this.delay()
    const page = await this.getPage(siteId, pageId)
    if (!page) throw new Error('Page not found')
    
    const blockIndex = page.blocks.findIndex(block => block.id === blockId)
    if (blockIndex === -1) throw new Error('Block not found')
    
    const updatedBlock = { ...page.blocks[blockIndex], ...updates }
    page.blocks[blockIndex] = updatedBlock
    
    await this.updatePage(siteId, pageId, { blocks: page.blocks })
    
    return updatedBlock
  }

  async deleteBlock(siteId: string, pageId: string, blockId: string): Promise<void> {
    await this.delay()
    const page = await this.getPage(siteId, pageId)
    if (!page) throw new Error('Page not found')
    
    const filteredBlocks = page.blocks.filter(block => block.id !== blockId)
    await this.updatePage(siteId, pageId, { blocks: filteredBlocks })
  }

  async reorderBlocks(siteId: string, pageId: string, blockIds: string[]): Promise<void> {
    await this.delay()
    const page = await this.getPage(siteId, pageId)
    if (!page) throw new Error('Page not found')
    
    const reorderedBlocks = blockIds.map((id, index) => {
      const block = page.blocks.find(b => b.id === id)
      if (!block) throw new Error(`Block ${id} not found`)
      return { ...block, order: index }
    })
    
    await this.updatePage(siteId, pageId, { blocks: reorderedBlocks })
  }

  // Media
  async getMedia(siteId: string): Promise<Media[]> {
    await this.delay()
    return this.getFromStorage(`media:${siteId}`, [])
  }

  async uploadMedia(siteId: string, file: File): Promise<Media> {
    await this.delay()
    
    // Size check (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size must be less than 2MB')
    }
    
    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    
    const media = await this.getMedia(siteId)
    const newMedia: Media = {
      id: generateId(),
      name: file.name,
      url: base64,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      uploadedAt: new Date().toISOString()
    }
    
    media.push(newMedia)
    this.setToStorage(`media:${siteId}`, media)
    
    return newMedia
  }

  async deleteMedia(siteId: string, mediaId: string): Promise<void> {
    await this.delay()
    const media = await this.getMedia(siteId)
    const filtered = media.filter(m => m.id !== mediaId)
    this.setToStorage(`media:${siteId}`, filtered)
  }

  // Versions
  async getVersions(siteId: string): Promise<Version[]> {
    await this.delay()
    return this.getFromStorage(`versions:${siteId}`, [])
  }

  async createVersion(siteId: string, name: string): Promise<Version> {
    await this.delay()
    const site = await this.getSite(siteId)
    if (!site) throw new Error('Site not found')
    
    const versions = await this.getVersions(siteId)
    const newVersion: Version = {
      id: generateId(),
      siteId,
      name,
      snapshot: { ...site },
      createdAt: new Date().toISOString(),
      isPublished: false
    }
    
    versions.push(newVersion)
    this.setToStorage(`versions:${siteId}`, versions)
    
    return newVersion
  }

  async revertToVersion(siteId: string, versionId: string): Promise<Site> {
    await this.delay()
    const versions = await this.getVersions(siteId)
    const version = versions.find(v => v.id === versionId)
    if (!version) throw new Error('Version not found')
    
    const restoredSite = {
      ...version.snapshot,
      updatedAt: new Date().toISOString()
    }
    
    await this.updateSite(siteId, restoredSite)
    return restoredSite
  }

  // Publishing
  async publishSite(siteId: string): Promise<PublishResult> {
    await this.delay(500)
    
    const site = await this.getSite(siteId)
    if (!site) throw new Error('Site not found')
    
    // Store published site data locally
    const publishedSites = this.getFromStorage('published-sites', {})
    publishedSites[site.slug] = {
      ...site,
      publishedAt: new Date().toISOString(),
      version: Date.now()
    }
    this.setToStorage('published-sites', publishedSites)
    
    // Create published version
    await this.createVersion(siteId, `Published ${new Date().toLocaleString()}`)
    
    const previewUrl = `${window.location.origin}/s/${site.slug}/`
    
    return {
      success: true,
      previewUrl,
      publishedAt: new Date().toISOString()
    }
  }

  async setDomain(siteId: string, domain: DomainConfig): Promise<{ success: boolean; message: string }> {
    await this.delay(300)
    
    // Generate domain string based on type
    let domainString = ''
    switch (domain.type) {
      case 'subdomain':
        domainString = `${domain.subdomain}.renterinsight.com`
        break
      case 'custom':
        domainString = domain.customDomain
        break
      case 'subdomain_custom':
        domainString = `${domain.subdomain}.${domain.baseDomain}`
        break
      case 'multi_dealer':
        domainString = `${domain.dealerCode}.${domain.groupDomain}`
        break
      default:
        return {
          success: false,
          message: 'Invalid domain type'
        }
    }
    
    // Store domain mapping locally
    const domainMappings = this.getFromStorage('domain-mappings', {})
    domainMappings[domainString] = {
      siteId,
      domain: domainString,
      type: domain.type,
      createdAt: new Date().toISOString(),
      config: domain
    }
    this.setToStorage('domain-mappings', domainMappings)
    
    // Update site with domain info
    await this.updateSite(siteId, { domain: domainString })
    
    return {
      success: true,
      message: 'Website address saved successfully!'
    }
  }

  // External data
  async getDefaultManufacturers(): Promise<Manufacturer[]> {
    await this.delay()
    
    // Return local manufacturer data
    return [
      {
        id: 'forest-river',
        name: 'Forest River',
        slug: 'forest-river',
        logoUrl: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://forestriver.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'jayco',
        name: 'Jayco',
        slug: 'jayco',
        logoUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://jayco.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'thor',
        name: 'Thor Motor Coach',
        slug: 'thor',
        logoUrl: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://thormotorcoach.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'grand-design',
        name: 'Grand Design',
        slug: 'grand-design',
        logoUrl: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://granddesignrv.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'clayton',
        name: 'Clayton Homes',
        slug: 'clayton',
        logoUrl: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://claytonhomes.com',
        enabled: true,
        linkType: 'external'
      },
      {
        id: 'champion',
        name: 'Champion Homes',
        slug: 'champion',
        logoUrl: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=100',
        externalUrl: 'https://championhomes.com',
        enabled: true,
        linkType: 'external'
      }
    ]
  }

  async getDemoInventory(): Promise<DemoInventoryItem[]> {
    await this.delay()
    
    // Return local demo inventory data
    return [
      {
        id: 'demo-rv-1',
        type: 'rv',
        title: '2023 Forest River Cherokee 274RK',
        price: 45000,
        image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          sleeps: 4,
          length: 28,
          slides: 1,
          year: 2023,
          make: 'Forest River',
          model: 'Cherokee 274RK'
        }
      },
      {
        id: 'demo-rv-2',
        type: 'rv',
        title: '2022 Jayco Jay Flight 28BHS',
        price: 38000,
        image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          sleeps: 6,
          length: 32,
          slides: 1,
          year: 2022,
          make: 'Jayco',
          model: 'Jay Flight 28BHS'
        }
      },
      {
        id: 'demo-rv-3',
        type: 'rv',
        title: '2024 Grand Design Solitude 310GK',
        price: 85000,
        image: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          sleeps: 6,
          length: 35,
          slides: 3,
          year: 2024,
          make: 'Grand Design',
          model: 'Solitude 310GK'
        }
      },
      {
        id: 'demo-mh-1',
        type: 'manufactured_home',
        title: '2023 Clayton The Edge',
        price: 95000,
        image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1450,
          year: 2023,
          make: 'Clayton',
          model: 'The Edge'
        }
      },
      {
        id: 'demo-mh-2',
        type: 'manufactured_home',
        title: '2022 Champion Titan',
        price: 75000,
        image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          bedrooms: 4,
          bathrooms: 2,
          sqft: 1800,
          year: 2022,
          make: 'Champion',
          model: 'Titan'
        }
      },
      {
        id: 'demo-mh-3',
        type: 'manufactured_home',
        title: '2024 Skyline Arrow',
        price: 125000,
        image: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=400',
        specs: {
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1600,
          year: 2024,
          make: 'Skyline',
          model: 'Arrow'
        }
      }
    ]
  }

  async getDemoLandHomePackages(): Promise<DemoLandHomePackage[]> {
    await this.delay()
    
    // Return local demo land/home package data
    return [
      {
        id: 'demo-land-1',
        type: 'land',
        title: 'Premium Corner Lot #42',
        price: 25000,
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Beautiful corner lot with all utilities available',
        features: ['Water hookup', 'Sewer connection', 'Electric service', 'Corner location', 'Mature trees']
      },
      {
        id: 'demo-land-2',
        type: 'land',
        title: 'Waterfront Lot #15',
        price: 35000,
        image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Stunning waterfront lot with private dock access',
        features: ['Waterfront', 'Private dock', 'All utilities', 'Paved road access', 'HOA amenities']
      },
      {
        id: 'demo-home-1',
        type: 'home',
        title: '2023 Clayton The Edge - 3BR/2BA',
        price: 95000,
        image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Brand new manufactured home with modern finishes',
        features: ['3 bedrooms', '2 bathrooms', '1450 sq ft', 'Energy efficient', 'Modern appliances']
      },
      {
        id: 'demo-package-1',
        type: 'package',
        title: 'Complete Home + Land Package',
        price: 120000,
        image: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Everything you need - home, land, and setup included',
        features: ['3BR/2BA Clayton home', 'Premium corner lot', 'Complete setup', 'Financing available', 'Move-in ready']
      },
      {
        id: 'demo-package-2',
        type: 'package',
        title: 'Waterfront Living Package',
        price: 155000,
        image: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Luxury waterfront living with premium home',
        features: ['4BR/2BA Champion home', 'Waterfront lot', 'Private dock', 'Premium finishes', 'Turnkey solution']
      },
      {
        id: 'demo-package-3',
        type: 'package',
        title: 'Starter Home Package',
        price: 85000,
        image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Affordable starter package perfect for first-time buyers',
        features: ['2BR/1BA home', 'Standard lot', 'Basic setup', 'Low down payment', 'First-time buyer friendly']
      }
    ]
  }
}