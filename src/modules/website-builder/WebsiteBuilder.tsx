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

function safeJsonParse<T = unknown>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function decodeBase64Url(data: string): string {
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

      try {
        // 1) URL data param (works with or without slug)
        const dataParam = searchParams.get('data')
        if (dataParam) {
          try {
            const decoded = decodeBase64Url(dataParam)
            const fromUrl = safeJsonParse<Site>(decoded)
            if (fromUrl) {
              setSite(fromUrl)
              return
            }
          } catch {
            // fallback: plain base64
            try {
              const decoded = atob(decodeURIComponent(dataParam))
              const fromUrl = safeJsonParse<Site>(decoded)
              if (fromUrl) {
                setSite(fromUrl)
                return
              }
            } catch {
              // ignore; move on to next sources
            }
          }
        }

        // 2) sessionStorage preview
        if (siteSlug) {
          const specific = safeJsonParse<Site>(
            sessionStorage.getItem(`wb2:preview-site:${siteSlug}`)
          )
          if (specific) {
            setSite(specific)
            return
          }
        } else {
          // if no slug, pick the first preview entry found
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i)
            if (key && key.startsWith('wb2:preview-site:')) {
              const anyPreview = safeJsonParse<Site>(sessionStorage.getItem(key))
              if (anyPreview) {
                setSite(anyPreview)
                return
              }
            }
          }
        }

        // 3) localStorage sites
        const localSites = safeJsonParse<Site[]>(localStorage.getItem('wb2:sites')) || []
        if (Array.isArray(localSites) && localSites.length) {
          if (siteSlug) {
            const found = localSites.find((s) => s.slug === siteSlug)
            if (found) {
              setSite(found)
              return
            }
          }
          // no slug or not found — fall back to first site
          setSite(localSites[0])
          return
        }

        // If we get here, we truly have no data
        setError('No website data available.')
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Available</h1>
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
