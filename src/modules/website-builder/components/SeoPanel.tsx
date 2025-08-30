import React, { useState } from 'react'
import { SeoMeta, Page } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Search, Globe, Eye } from 'lucide-react'

interface SeoPanelProps {
  seoMeta: SeoMeta
  pages: Page[]
  onUpdateSeo: (seo: SeoMeta) => void
}

export function SeoPanel({ seoMeta, pages, onUpdateSeo }: SeoPanelProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>('')

  const updateSiteDefaults = (updates: Partial<SeoMeta['siteDefaults']>) => {
    onUpdateSeo({
      ...seoMeta,
      siteDefaults: {
        ...seoMeta.siteDefaults,
        ...updates
      }
    })
  }

  const updatePageSeo = (pageId: string, updates: Partial<SeoMeta['pages'][string]>) => {
    onUpdateSeo({
      ...seoMeta,
      pages: {
        ...seoMeta.pages,
        [pageId]: {
          ...seoMeta.pages[pageId],
          ...updates
        }
      }
    })
  }

  const getPageSeo = (pageId: string) => {
    return seoMeta.pages[pageId] || {}
  }

  const generatePreview = (title?: string, description?: string, url?: string) => {
    const previewTitle = title || seoMeta.siteDefaults.title || 'Your Website'
    const previewDescription = description || seoMeta.siteDefaults.description || 'Website description'
    const previewUrl = url || 'https://yourwebsite.com'

    return (
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="text-xs text-green-600 mb-1">{previewUrl}</div>
        <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
          {previewTitle}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {previewDescription}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5" />
        <h3 className="text-lg font-semibold">SEO & Meta Tags</h3>
      </div>

      <Tabs defaultValue="site" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="site">Site Defaults</TabsTrigger>
          <TabsTrigger value="pages">Page-Specific</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Site-wide SEO Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-title">Default Title</Label>
                <Input
                  id="site-title"
                  value={seoMeta.siteDefaults.title || ''}
                  onChange={(e) => updateSiteDefaults({ title: e.target.value })}
                  placeholder="Your Website Name"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used when pages don't have a specific title
                </p>
              </div>

              <div>
                <Label htmlFor="site-description">Default Description</Label>
                <Textarea
                  id="site-description"
                  value={seoMeta.siteDefaults.description || ''}
                  onChange={(e) => updateSiteDefaults({ description: e.target.value })}
                  placeholder="A brief description of your website"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  150-160 characters recommended
                </p>
              </div>

              <div>
                <Label htmlFor="site-og-image">Default Open Graph Image</Label>
                <Input
                  id="site-og-image"
                  value={seoMeta.siteDefaults.ogImageUrl || ''}
                  onChange={(e) => updateSiteDefaults({ ogImageUrl: e.target.value })}
                  placeholder="https://yoursite.com/og-image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1200x630px recommended for social media sharing
                </p>
              </div>

              <div>
                <Label htmlFor="site-robots">Robots Meta</Label>
                <select
                  id="site-robots"
                  value={seoMeta.siteDefaults.robots || 'index,follow'}
                  onChange={(e) => updateSiteDefaults({ robots: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="index,follow">Index, Follow (Default)</option>
                  <option value="noindex,nofollow">No Index, No Follow</option>
                  <option value="index,nofollow">Index, No Follow</option>
                  <option value="noindex,follow">No Index, Follow</option>
                </select>
              </div>

              <div>
                <Label htmlFor="canonical-base">Canonical Base URL</Label>
                <Input
                  id="canonical-base"
                  value={seoMeta.siteDefaults.canonicalBase || ''}
                  onChange={(e) => updateSiteDefaults({ canonicalBase: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Preview */}
              <div>
                <Label>Search Result Preview</Label>
                {generatePreview(
                  seoMeta.siteDefaults.title,
                  seoMeta.siteDefaults.description,
                  seoMeta.siteDefaults.canonicalBase
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page-Specific SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="page-select">Select Page</Label>
                <select
                  id="page-select"
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a page...</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>
                      {page.title} ({page.path})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPageId && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {pages.find(p => p.id === selectedPageId)?.title}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {pages.find(p => p.id === selectedPageId)?.path}
                    </span>
                  </div>

                  <div>
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input
                      id="page-title"
                      value={getPageSeo(selectedPageId).title || ''}
                      onChange={(e) => updatePageSeo(selectedPageId, { title: e.target.value })}
                      placeholder="Page-specific title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="page-description">Page Description</Label>
                    <Textarea
                      id="page-description"
                      value={getPageSeo(selectedPageId).description || ''}
                      onChange={(e) => updatePageSeo(selectedPageId, { description: e.target.value })}
                      placeholder="Page-specific description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="page-og-image">Page Open Graph Image</Label>
                    <Input
                      id="page-og-image"
                      value={getPageSeo(selectedPageId).ogImageUrl || ''}
                      onChange={(e) => updatePageSeo(selectedPageId, { ogImageUrl: e.target.value })}
                      placeholder="https://yoursite.com/page-image.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="page-canonical">Canonical Path</Label>
                    <Input
                      id="page-canonical"
                      value={getPageSeo(selectedPageId).canonicalPath || ''}
                      onChange={(e) => updatePageSeo(selectedPageId, { canonicalPath: e.target.value })}
                      placeholder="/about"
                    />
                  </div>

                  {/* Page Preview */}
                  <div>
                    <Label>Search Result Preview</Label>
                    {generatePreview(
                      getPageSeo(selectedPageId).title || pages.find(p => p.id === selectedPageId)?.title,
                      getPageSeo(selectedPageId).description,
                      `${seoMeta.siteDefaults.canonicalBase || 'https://yourwebsite.com'}${getPageSeo(selectedPageId).canonicalPath || pages.find(p => p.id === selectedPageId)?.path}`
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}