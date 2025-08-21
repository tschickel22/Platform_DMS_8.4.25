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

        console.log('Loading site preview for slug:', siteSlug)
        console.log('Search params:', searchParams.toString())

        // First, try to get site data from URL parameters (for direct preview links)
        const dataParam = searchParams.get('data')
        if (dataParam) {
          console.log('Found data parameter, attempting to parse...')
          try {
            const decodedData = decodeURIComponent(dataParam)
            const siteData = JSON.parse(decodedData)
            console.log('Successfully parsed site data from URL:', siteData)
            setSite(siteData)
            setLoading(false)
            return
          } catch (err) {
            console.error('Failed to parse URL data parameter:', err)
          }
        }

        // Second, try to get site data from sessionStorage (for live preview)
        if (siteSlug) {
          const sessionKey = `wb2:preview:${siteSlug}`
          console.log('Checking sessionStorage with key:', sessionKey)
          const sessionData = sessionStorage.getItem(sessionKey)
          if (sessionData) {
            console.log('Found session data, attempting to parse...')
            try {
              const siteData = JSON.parse(sessionData)
              console.log('Successfully parsed site data from session:', siteData)
              setSite(siteData)
              setLoading(false)
              return
            } catch (err) {
              console.error('Failed to parse session data:', err)
            }
          }
        }

        // Third, try to get site data from localStorage (for saved sites)
        if (siteSlug) {
          console.log('Checking localStorage for sites...')
          const localSites = localStorage.getItem('wb2:sites')
          if (localSites) {
            try {
              const sites = JSON.parse(localSites)
              console.log('Found sites in localStorage:', sites.length, 'sites')
              const foundSite = sites.find((s: Site) => s.slug === siteSlug || s.id === siteSlug)
              if (foundSite) {
                console.log('Found matching site:', foundSite)
                setSite(foundSite)
                setLoading(false)
                return
              } else {
                console.log('No matching site found for slug:', siteSlug)
              }
            } catch (err) {
              console.error('Failed to parse localStorage sites:', err)
            }
          }
        }

        // If no site found, show error
        console.error('No site data found for slug:', siteSlug)
        setError('Website not found. Please ensure the site exists and try again.')
      } catch (err) {
        console.error('Error loading site for preview:', err)
        setError('Failed to load website preview.')
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
          <p className="text-gray-600">Loading website preview...</p>
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
        </div>
      </div>
    )
  }

  return <SiteRenderer site={site} />
}