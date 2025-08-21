import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SiteRenderer } from '@/components/SiteRenderer'

interface Site {
  id: string
  name: string
  slug: string
  pages: Page[]
  theme?: Theme
  nav?: NavConfig
  brand?: { logoUrl?: string; color?: string }
  faviconUrl?: string
  seo?: SeoMeta
  tracking?: Tracking
}

interface Page {
  id: string
  title: string
  path: string
  blocks: Block[]
  seo?: PageSeo
}

interface Block {
  id: string
  type: string
  content: any
  order: number
}

interface Theme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

interface NavConfig {
  manufacturersMenu: {
    enabled: boolean
    label: string
    items: Manufacturer[]
  }
  showLandHomeMenu?: boolean
  landHomeLabel?: string
}

interface Manufacturer {
  id: string
  name: string
  slug: string
  logoUrl?: string
  externalUrl?: string
  enabled: boolean
  linkType: 'inventory' | 'external'
}

interface SeoMeta {
  siteDefaults: {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalBase?: string
  }
  pages: Record<
    string,
    {
      title?: string
      description?: string
      ogImageUrl?: string
      robots?: string
      canonicalPath?: string
    }
  >
}

interface PageSeo {
  title?: string
  description?: string
  ogImageUrl?: string
  robots?: string
  canonicalPath?: string
}

interface Tracking {
  ga4Id?: string
  gtagId?: string
  gtmId?: string
  headHtml?: string
  bodyEndHtml?: string
}

function safeJsonParse<T = unknown>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function decodeBase64Url(data: string): string {
  // Support base64url ( - _ ) and add padding if needed
  let s = data.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad) s += '='.repeat(4 - pad)
  return atob(decodeURIComponent(s))
}

export default function PublicSitePreview() {
  const { siteSlug } = useParams<{ siteSlug: string }>()
  const [searchParams] = useSearchParams()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSite = async () => {
      setLoading(true)
      setError(null)
      setSite(null)

      if (!siteSlug) {
        setError('No site specified in URL')
        setLoading(false)
        return
      }

      try {
        // Method 1: sessionStorage preview data
        const sessionKey = `wb2:preview-site:${siteSlug}`
        const sessionData = sessionStorage.getItem(sessionKey)
        if (sessionData) {
          const siteData = safeJsonParse<Site>(sessionData)
          if (siteData) {
            setSite(siteData)
            return
          } else {
            console.warn('Failed to parse session data for preview')
          }
        }

        // Method 2: URL ?data= (base64/base64url-encoded JSON)
        const dataParam = searchParams.get('data')
        if (dataParam) {
          try {
            const decoded =
              // try base64url first, fall back to plain atob decodeURIComponent
              decodeBase64Url(dataParam)
            const siteData = safeJsonParse<Site>(decoded)
            if (siteData) {
              setSite(siteData)
              return
            }
          } catch (e) {
            // Fallback attempt for plain base64
            try {
              const decoded = atob(decodeURIComponent(dataParam))
              const siteData = safeJsonParse<Site>(decoded)
              if (siteData) {
                setSite(siteData)
                return
              }
            } catch {
              console.warn('Failed to parse URL data param')
            }
          }
        }

        // Method 3: localStorage saved sites
        const localSitesRaw = localStorage.getItem('wb2:sites')
        if (localSitesRaw) {
          const sites = safeJsonParse<Site[]>(localSitesRaw) || []
          const found = Array.isArray(sites)
            ? sites.find((s) => s.slug === siteSlug)
            : null
          if (found) {
            setSite(found)
            return
          }
        }

        // If nothing hit, set a friendly error
        setError(`No website data found for slug "${siteSlug}".`)
      } catch (e) {
        console.error('Error loading site', e)
        setError('An unexpected error occurred while loading the website.')
      } finally {
        setLoading(false)
      }
    }

    void loadSite()
  }, [siteSlug, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading website...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No website data available</p>
        </div>
      </div>
    )
  }

  return <SiteRenderer site={site} />
}
