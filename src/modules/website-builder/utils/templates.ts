// src/modules/website-builder/utils/templates.ts

// Enhanced website templates with complete page structures
import { rvDealerProfessionalTemplate } from './templates-data/rv-dealer-professional'
import { manufacturedHomeDealerTemplate } from './templates-data/manufactured-home-dealer'
import { luxuryRVDealerTemplate } from './templates-data/luxury-rv-dealer'
import { generalDealerTemplate } from './templates-data/general-dealer'

export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  category: 'rv_dealer' | 'manufactured_home' | 'general' | 'luxury'
  previewImage: string
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  pages: TemplatePageDefinition[]
  nav: {
    manufacturersMenu: {
      enabled: boolean
      label: string
      items: any[]
    }
    showLandHomeMenu?: boolean
    landHomeLabel?: string
  }
  seo: {
    siteDefaults: {
      title: string
      description: string
      robots: string
    }
  }
}

export interface TemplatePageDefinition {
  title: string
  path: string
  blocks: TemplateBlockDefinition[]
  seo?: {
    title?: string
    description?: string
  }
}

export interface TemplateBlockDefinition {
  type: string
  content: any
  order: number
}

// ---- Aggregate all template definitions here ----
export const websiteTemplates: WebsiteTemplate[] = [
  rvDealerProfessionalTemplate,
  manufacturedHomeDealerTemplate,
  luxuryRVDealerTemplate,
  generalDealerTemplate
]

// Back-compat: some modules import { getWebsiteTemplates }
export function getWebsiteTemplates(): WebsiteTemplate[] {
  return websiteTemplates
}

// Back-compat: some modules import { getTemplate }
export function getTemplate(id: string): WebsiteTemplate | null {
  return getTemplateById(id)
}

export function getTemplateById(id: string): WebsiteTemplate | null {
  return websiteTemplates.find((template) => template.id === id) || null
}

export function getTemplatesByCategory(
  category: WebsiteTemplate['category']
): WebsiteTemplate[] {
  return websiteTemplates.filter((t) => t.category === category)
}

// Helpful aliases (retain existing imports elsewhere)
export const siteTemplates = websiteTemplates
export const defaultTemplates = websiteTemplates
export { websiteTemplates as templates }

// Utility to instantiate a site object from a template
export function createSiteFromTemplate(
  template: WebsiteTemplate,
  siteName: string,
  siteSlug: string
): any {
  return {
    name: siteName,
    slug: siteSlug,
    theme: template.theme,
    nav: template.nav,
    seo: template.seo,
    pages: template.pages.map((page, index) => ({
      id: `page-${index + 1}`,
      title: page.title,
      path: page.path,
      order: index,
      seo: page.seo,
      blocks: page.blocks.map((block, blockIndex) => ({
        id: `block-${blockIndex + 1}`,
        type: block.type,
        content: block.content,
        order: block.order
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
