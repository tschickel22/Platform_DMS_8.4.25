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
  pages: Record<string, {
    title?: string
    description?: string
    ogImageUrl?: string
    robots?: string
    canonicalPath?: string
  }>
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

export default function PublicSitePreview() {
  const { siteSlug } = useParams<{ siteSlug: string }>()
  const [searchParams] = useSearchParams()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSite()
  }, [siteSlug])

  const loadSite = async () => {
    if (!siteSlug) {
      setError('No site specified in URL')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Method 1: Check sessionStorage for local preview data
      const sessionKey = `wb2:preview-site:${siteSlug}`
      const sessionData = sessionStorage.getItem(sessionKey)
      if (sessionData) {
        try {
          const siteData = JSON.parse(sessionData)
          setSite(siteData)
          setLoading(false)
          return
        } catch (err) {
          console.warn('Failed to parse session data:', err)
        }
      }

      // Method 2: Check URL data parameter
      const dataParam = searchParams.get('data')
      if (dataParam) {
        try {
          const decoded = decodeURIComponent(atob(dataParam))
          const siteData = JSON.parse(decoded)
          setSite(siteData)
          setLoading(false)
          return
        } catch (err) {
          console.warn('Failed to parse URL data:', err)
        }
      }

      // Method 3: Check localStorage for saved sites
      try {
        const localSites = localStorage.getItem('wb2:sites')
        if (localSites) {
          const sites = JSON.parse(localSites)
          const foundSite = sites.find((s: Site) => s.slug === siteSlug)
          if (foundSite) {
            setSite(foundSite)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Failed to load from localStorage:', err)
      }

      // Method 4: Try to fetch from Netlify function (published sites)
      try {
        const response = await fetch(`/.netlify/functions/get-site?site=${encodeURIComponent(siteSlug)}`)
        if (response.ok) {
          const siteData = await response.json()
          setSite(siteData)
          setLoading(false)
          return
        } else if (response.status === 404) {
          setError('Website not found')
        } else {
          setError(`Failed to load website: ${response.statusText}`)
        }
      } catch (err) {
        console.warn('Failed to fetch from Netlify function:', err)
        setError('Website not found or not published')
      }

    } catch (err) {
      console.error('Error loading site:', err)
      setError(err instanceof Error ? err.message : 'Failed to load website')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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