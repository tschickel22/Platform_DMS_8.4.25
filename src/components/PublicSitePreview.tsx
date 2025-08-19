import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Site { id: string; name: string; slug: string; pages: Page[]; theme?: Theme; nav?: NavConfig; brand?: { logoUrl?: string; color?: string }; faviconUrl?: string; seo?: SeoMeta; tracking?: Tracking }
interface Page { id: string; title: string; path: string; blocks: Block[]; seo?: PageSeo }
interface Block { id: string; type: string; content: any; order: number }
interface Theme { primaryColor: string; secondaryColor: string; fontFamily: string }
interface NavConfig { manufacturersMenu: { enabled: boolean; label: string; items: Manufacturer[] }; showLandHomeMenu?: boolean; landHomeLabel?: string }
interface Manufacturer { id: string; name: string; slug: string; logoUrl?: string; externalUrl?: string; enabled: boolean; linkType: 'inventory' | 'external' }
interface SeoMeta { siteDefaults: { title?: string; description?: string; ogImageUrl?: string; robots?: string; canonicalBase?: string }; pages: Record<string, { title?: string; description?: string; ogImageUrl?: string; robots?: string; canonicalPath?: string }> }
interface PageSeo { title?: string; description?: string; ogImageUrl?: string; robots?: string; canonicalPath?: string }
interface Tracking { ga4Id?: string; gtagId?: string; gtmId?: string; headHtml?: string; bodyEndHtml?: string }

const decodeQueryData = (): Site | null => {
  try {
    const q = new URLSearchParams(window.location.search)
    const raw = q.get('data')
    if (raw) {
      const json = decodeURIComponent(atob(raw))
      return JSON.parse(json)
    }
    // some sandboxes move query into hash
    if (window.location.hash.includes('data=')) {
      const h = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const raw2 = h.get('data')
      if (raw2) {
        const json = decodeURIComponent(atob(raw2))
        return JSON.parse(json)
      }
    }
    return null
  } catch { return null }
}

function SiteRenderer({ site }: { site: Site }) {
  const { '*': pagePath } = useParams()
  const currentPath = `/${(pagePath || '').replace(/^\/+/, '')}`
  const primaryColor = site.brand?.color || site.theme?.primaryColor || '#3b82f6'
  const currentPage = site.pages.find(p => p.path === currentPath) || site.pages[0]

  if (!currentPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    )
  }

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <section key={block.id} className="relative bg-gray-900 text-white">
            {block.content?.backgroundImage && (
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${block.content.backgroundImage})` }}>
                <div className="absolute inset-0 bg-black/50" />
              </div>
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                {block.content?.title && <h1 className="text-4xl md:text-6xl font-bold mb-6">{block.content.title}</h1>}
                {block.content?.subtitle && <p className="text-xl md:text-2xl mb-8 text-gray-200">{block.content.subtitle}</p>}
                {block.content?.ctaText && (
                  <button className="px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                          style={{ backgroundColor: primaryColor, color: 'white' }}
                          onClick={() => block.content.ctaLink && (window.location.href = block.content.ctaLink)}>
                    {block.content.ctaText}
                  </button>
                )}
              </div>
            </div>
          </section>
        )
      case 'text':
        return (
          <section key={block.id} className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`prose prose-lg max-w-none ${block.content?.alignment || 'text-left'}`}
                   dangerouslySetInnerHTML={{ __html: block.content?.html || block.content?.text || '' }} />
            </div>
          </section>
        )
      case 'image':
        return (
          <section key={block.id} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-${block.content?.alignment || 'center'}`}>
                {block.content?.src && <img src={block.content.src} alt={block.content?.alt || ''} className="max-w-full h-auto rounded-lg shadow-lg" />}
                {block.content?.caption && <p className="mt-4 text-gray-600 text-sm">{block.content.caption}</p>}
              </div>
            </div>
          </section>
        )
      default:
        return (
          <div key={block.id} className="py-8 px-4 bg-yellow-50 border border-yellow-200">
            <p className="text-center text-yellow-800">Unknown block type: {block.type}</p>
          </div>
        )
    }
  }

  const sortedBlocks = [...(currentPage.blocks || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {site.brand?.logoUrl ? <img src={site.brand.logoUrl} alt={site.name} className="h-8 w-auto" /> : <span className="text-xl font-bold" style={{ color: primaryColor }}>{site.name}</span>}
            </div>
            <div className="flex space-x-8">
              {site.pages.map(page => (
                <a key={page.id}
                   href={`/s/${site.slug}${page.path}`}
                   className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium ${page.path === currentPath ? 'border-b-2' : ''}`}
                   style={{ borderColor: page.path === currentPath ? primaryColor : 'transparent' }}>
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main>{sortedBlocks.map(renderBlock)}</main>
    </div>
  )
}

export default function PublicSitePreview() {
  const { siteSlug } = useParams()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const resolvedRef = useRef(false)

  useEffect(() => {
    if (!siteSlug) {
      setError('No site specified'); setLoading(false); return
    }

    const finish = (data: Site | null, err?: string) => {
      if (resolvedRef.current) return
      resolvedRef.current = true
      if (data) { setSite(data); setError(null) } else if (err) { setError(err) }
      setLoading(false)
    }

    // 1) URL param
    const fromQuery = decodeQueryData()
    if (fromQuery) return finish(fromQuery)

    // 2) Storage (session then local)
    const key = `wb2:preview-site:${siteSlug}`
    try { const ss = sessionStorage.getItem(key); if (ss) return finish(JSON.parse(ss)) } catch {}
    try { const ls = localStorage.getItem(key); if (ls) return finish(JSON.parse(ls)) } catch {}

    // 3) postMessage handshake with retry
    const onMessage = (evt: MessageEvent) => {
      const data = evt.data as any
      if (data?.type !== 'wb2:site-preview:response') return
      if (data?.slug !== siteSlug) return
      finish(data.site as Site)
      window.removeEventListener('message', onMessage)
    }
    window.addEventListener('message', onMessage)

    const request = { type: 'wb2:site-preview:request', slug: siteSlug }
    const ping = () => {
      try { window.opener?.postMessage(request, '*') } catch {}
      try { if (window.parent && window.parent !== window) window.parent.postMessage(request, '*') } catch {}
      try { window.postMessage(request, '*') } catch {}
    }

    // ping a few times to beat loading races
    let count = 0
    const max = 6
    const iv = window.setInterval(() => {
      if (resolvedRef.current || count >= max) { window.clearInterval(iv); return }
      ping(); count += 1
    }, 300)

    // hard timeout -> error
    const to = window.setTimeout(() => {
      if (!resolvedRef.current) finish(null,
        `Website '${siteSlug}' not found. Open the preview from the Website Builder so it can pass the data across origins.`
      )
    }, 2500)

    return () => {
      window.removeEventListener('message', onMessage)
      window.clearInterval(iv)
      window.clearTimeout(to)
    }
  }, [siteSlug])

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
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><p className="text-gray-600">No website data available</p></div>
      </div>
    )
  }

  return <SiteRenderer site={site} />
}
