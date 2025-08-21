import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SiteRenderer } from '@/components/SiteRenderer'
import { Site } from '@/modules/website-builder/types'

export default function PublicSitePreview() {
  const { siteSlug } = useParams<{ siteSlug: string }>()
  const [searchParams] = useSearchParams()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true)
        setError(null)

        // First, try to get site data from URL parameters (for shared preview links)
        const dataParam = searchParams.get('data')
        if (dataParam) {
          try {
            const decodedData = decodeURIComponent(dataParam)
            const siteData = JSON.parse(decodedData)
            setSite(siteData)
            setLoading(false)
            return
          } catch (err) {
            console.warn('Failed to parse URL data parameter:', err)
          }
        }

        // Second, try to get site data from sessionStorage (for live preview from editor)
        if (siteSlug) {
          const sessionKey = `wb2:preview:${siteSlug}`
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
        }

        // Third, try to get site data from localStorage (for published sites)
        if (siteSlug) {
          // Check published sites first
          const publishedSites = localStorage.getItem('wb2:published-sites')
          if (publishedSites) {
            try {
              const sites = JSON.parse(publishedSites)
              const foundSite = sites[siteSlug]
              if (foundSite) {
                setSite(foundSite)
                setLoading(false)
                return
              }
            } catch (err) {
              console.warn('Failed to parse published sites:', err)
            }
          }
          
          // Fallback to regular sites storage
          const localSites = localStorage.getItem('wb2:sites')
          if (localSites) {
            try {
              const sites = JSON.parse(localSites)
              const foundSite = sites.find((s: Site) => s.slug === siteSlug || s.id === siteSlug)
              if (foundSite) {
                setSite(foundSite)
                setLoading(false)
                return
              }
            } catch (err) {
              console.warn('Failed to parse local sites:', err)
            }
          }
        }

        // If no site found, show error
        setError(`Website "${siteSlug}" not found. Please ensure the site exists and has been published.`)
      } catch (err) {
        console.error('Error loading site for preview:', err)
        setError('Failed to load website preview. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadSite()
  }, [siteSlug, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Bolt preview...</p>
          <p className="text-gray-500 text-sm mt-2">Site: {siteSlug}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-100 rounded">
            Looking for: {siteSlug}<br/>
            URL: {window.location.href}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mr-2"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.close()} 
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Close Preview
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
          <p className="text-gray-500 text-sm mt-2">Site slug: {siteSlug}</p>
        </div>
      </div>
    )
  }

  return <SiteRenderer site={site} />
}