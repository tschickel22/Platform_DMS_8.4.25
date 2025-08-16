import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Image, 
  Palette, 
  Navigation, 
  Search, 
  BarChart3, 
  Globe,
  Settings,
  Loader2
} from 'lucide-react'
import { useSite } from './hooks/useSite'
import { computeWebsiteBuilderCaps } from '@/shared/featureFlags'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { PageList } from './components/PageList'
import { EditorCanvas } from './components/EditorCanvas'
import { MediaManager } from './components/MediaManager'
import { ThemePalette } from './components/ThemePalette'
import { NavigationPanel } from './components/NavigationPanel'
import { SeoPanel } from './components/SeoPanel'
import { TrackingTagsPanel } from './components/TrackingTagsPanel'
import { PublishPanel } from './components/PublishPanel'
import { Site, Page, Theme, Brand, NavConfig, SeoMeta, Tracking } from './types'

interface WebsiteBuilderProps {
  mode: 'platform' | 'company'
}

export function WebsiteBuilder({ mode }: WebsiteBuilderProps) {
  const { siteId } = useParams<{ siteId: string }>()
  const { user } = useAuth()
  const { tenant } = useTenant()
  const { site, sites, loading, createSite, updateSite } = useSite(siteId)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [activeTab, setActiveTab] = useState('pages')

  const roles = user?.role ? [user.role] : []
  const companyId = tenant?.id || null
  const caps = computeWebsiteBuilderCaps({ roles, companyId })

  // Auto-select first page when site loads
  useEffect(() => {
    if (site && site.pages.length > 0 && !selectedPage) {
      setSelectedPage(site.pages[0])
    }
  }, [site, selectedPage])

  // Create default site if none exists
  useEffect(() => {
    if (!loading && !siteId && sites.length === 0) {
      handleCreateDefaultSite()
    }
  }, [loading, siteId, sites])

  const handleCreateDefaultSite = async () => {
    const defaultSite = await createSite({
      name: mode === 'platform' ? 'Platform Website' : `${tenant?.name || 'Company'} Website`,
      slug: mode === 'platform' ? 'platform-site' : (tenant?.name?.toLowerCase().replace(/\s+/g, '-') || 'company-site'),
      pages: [
        {
          title: 'Home',
          path: '/',
          blocks: [],
          isVisible: true,
          order: 0
        }
      ],
      nav: {
        manufacturersMenu: {
          enabled: false,
          label: 'Manufacturers',
          items: [],
          allowCustom: true
        }
      },
      seo: {
        siteDefaults: {},
        pages: {}
      },
      tracking: {}
    })

    if (defaultSite && defaultSite.pages.length > 0) {
      setSelectedPage(defaultSite.pages[0])
    }
  }

  const handleUpdatePage = async (updates: Partial<Page>) => {
    if (!site || !selectedPage) return

    const updatedPages = site.pages.map(page =>
      page.id === selectedPage.id ? { ...page, ...updates } : page
    )

    const updatedSite = await updateSite(site.id, { pages: updatedPages })
    if (updatedSite) {
      const updatedPage = updatedSite.pages.find(p => p.id === selectedPage.id)
      if (updatedPage) {
        setSelectedPage(updatedPage)
      }
    }
  }

  const handleUpdateTheme = async (theme: Theme) => {
    if (!site) return
    await updateSite(site.id, { theme })
  }

  const handleUpdateBrand = async (brand: Brand) => {
    if (!site) return
    await updateSite(site.id, { brand })
  }

  const handleUpdateNav = async (nav: NavConfig) => {
    if (!site) return
    await updateSite(site.id, { nav })
  }

  const handleUpdateSeo = async (seo: SeoMeta) => {
    if (!site) return
    await updateSite(site.id, { seo })
  }

  const handleUpdateTracking = async (tracking: Tracking) => {
    if (!site) return
    await updateSite(site.id, { tracking })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading website builder...</p>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Website Found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first website to get started
            </p>
            <Button onClick={handleCreateDefaultSite}>
              Create Website
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabItems = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'tracking', label: 'Tracking', icon: BarChart3 },
    { id: 'publish', label: 'Publish', icon: Globe },
    ...(caps.canManageHosting ? [{ id: 'hosting', label: 'Hosting', icon: Settings }] : [])
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Website Builder</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-muted-foreground">{site.name}</p>
            <Badge variant="outline">{mode}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/s/${site.slug}/`, '_blank')}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {tabItems.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-1">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          {selectedPage ? (
            <EditorCanvas
              page={selectedPage}
              onUpdatePage={handleUpdatePage}
            />
          ) : (
            <PageList
              siteId={site.id}
              onPageSelect={setSelectedPage}
              selectedPageId={selectedPage?.id}
            />
          )}
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaManager siteId={site.id} />
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <ThemePalette
            theme={site.theme}
            brand={site.brand}
            onUpdateTheme={handleUpdateTheme}
            onUpdateBrand={handleUpdateBrand}
          />
        </TabsContent>

        <TabsContent value="navigation" className="mt-6">
          <NavigationPanel
            navConfig={site.nav || { manufacturersMenu: { enabled: false, label: 'Manufacturers', items: [], allowCustom: true } }}
            onUpdateNav={handleUpdateNav}
          />
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <SeoPanel
            seoMeta={site.seo || { siteDefaults: {}, pages: {} }}
            pages={site.pages}
            onUpdateSeo={handleUpdateSeo}
          />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <TrackingTagsPanel
            tracking={site.tracking || {}}
            onUpdateTracking={handleUpdateTracking}
          />
        </TabsContent>

        <TabsContent value="publish" className="mt-6">
          <PublishPanel
            site={site}
            onUpdateSite={(updates) => updateSite(site.id, updates)}
          />
        </TabsContent>

        {caps.canManageHosting && (
          <TabsContent value="hosting" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hosting Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4" />
                  <p>Advanced hosting features coming soon</p>
                  <p className="text-sm">SSL certificates, custom domains, CDN settings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}