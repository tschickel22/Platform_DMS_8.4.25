import React, { useMemo, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Building,
  Home,
  DollarSign,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Users,
  Ruler,
  Share as ShareIcon,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Printer
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// ---- Robust mock import (works with several export shapes) ----
import * as ListingsMock from '@/mocks/listingsMock'

type Listing = any

const asArray = (val: any): Listing[] =>
  Array.isArray(val)
    ? val
    : Array.isArray(val?.listings)
    ? val.listings
    : Array.isArray(val?.sampleListings)
    ? val.sampleListings
    : Array.isArray(val?.mockListings)
    ? val.mockListings
    : Array.isArray(val?.default)
    ? val.default
    : []

const ALL_LISTINGS: Listing[] = asArray(ListingsMock)

// ---- helpers ----
const priceOf = (l: Listing): number =>
  Number(l?.salePrice ?? l?.rentPrice ?? 0) || 0

const formatPrice = (l: Listing) => {
  const sale = Number(l?.salePrice)
  const rent = Number(l?.rentPrice)
  if (Number.isFinite(sale) && sale > 0) return `$${sale.toLocaleString()}`
  if (Number.isFinite(rent) && rent > 0) return `$${rent.toLocaleString()}/mo`
  return 'Price on request'
}

const statusBadge = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'active':
      return 'bg-green-500'
    case 'draft':
      return 'bg-yellow-500'
    case 'inactive':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

const typeBadge = (type?: string) => {
  switch ((type || '').toLowerCase()) {
    case 'manufactured_home':
      return 'bg-blue-500'
    case 'rv':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

// ---- Print helper ----
function printShareSheet(opts: {
  companyName: string
  shareUrl: string
  total: number
  active: number
  avg: number
  totalValue: number
  featured: Listing[]
}) {
  const { companyName, shareUrl, total, active, avg, totalValue, featured } = opts
  const previewImg =
    featured?.[0]?.media?.primaryPhoto ||
    featured?.[0]?.imageUrl ||
    'https://picsum.photos/600/340'

  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${companyName} – Listings Share</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    *{box-sizing:border-box;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial}
    body{margin:0;background:#f6f7f9;color:#0f172a}
    .sheet{max-width:900px;margin:0 auto;padding:32px}
    .hero{display:flex;gap:24px;align-items:center;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
    .hero img{width:280px;height:180px;object-fit:cover;border-radius:12px}
    .title{font-size:22px;font-weight:700;margin:0 0 4px}
    .muted{color:#64748b}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:24px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
    .label{font-size:12px;color:#64748b;margin-bottom:6px}
    .pill{display:inline-block;background:#0f172a;color:white;border-radius:999px;padding:6px 12px;text-decoration:none}
    @media print {.noprint{display:none}}
  </style>
</head>
<body>
  <div class="sheet">
    <div class="hero">
      <img src="${previewImg}" alt="Preview"/>
      <div>
        <div class="title">${companyName} — ${active} Available</div>
        <div class="muted">Browse ${total} listings • Avg $${avg.toLocaleString()}</div>
        <div style="margin-top:12px">
          <a class="pill" href="${shareUrl}">${shareUrl}</a>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="label">What's Shared</div>
        <div>Total Listings: <b>${total}</b></div>
        <div>Active: <b>${active}</b></div>
        <div>Average Price: <b>$${avg.toLocaleString()}</b></div>
        <div>Total Value: <b>$${totalValue.toLocaleString()}</b></div>
      </div>
      <div class="card">
        <div class="label">Featured</div>
        <div>${featured.slice(0, 5).map((l:any) => (l?.title || l?.model || 'Listing')).join(' • ')}</div>
      </div>
    </div>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`
  win.document.open()
  win.document.write(html)
  win.document.close()
}

// ---- Share dialog (with Social + Print) ----
function ShareAllListingsDialog({
  open,
  onOpenChange,
  companyName = 'Demo RV Dealership',
  companySlug = 'demo',
  total,
  active,
  avg,
  listings,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  companyName?: string
  companySlug?: string
  total: number
  active: number
  avg: number
  listings: Listing[]
}) {
  const shareUrl = `${window.location.origin}/public/${companySlug}/listings`
  const totalValue = listings.reduce((s, l) => s + priceOf(l), 0)

  const openShare = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=700,height=600')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share All Listings</DialogTitle>
        </DialogHeader>

        {/* Social Preview */}
        <div className="flex items-center gap-4 border rounded-xl p-3">
          <img
            src={
              listings?.[0]?.media?.primaryPhoto ||
              listings?.[0]?.imageUrl ||
              'https://picsum.photos/200/120'
            }
            alt="Preview"
            className="w-28 h-20 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <div className="font-medium truncate">{companyName} — {active} Available</div>
            <div className="text-xs text-muted-foreground truncate">Browse {total} listings • Avg ${avg.toLocaleString()}</div>
          </div>
        </div>

        {/* Shareable Link + Quick Share */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Shareable Link</div>
          <div className="flex gap-2">
            <Input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} />
            <Button
              onClick={() => navigator.clipboard?.writeText(shareUrl)}
              variant="secondary"
              className="shrink-0"
              title="Copy link"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => openShare(`mailto:?subject=${encodeURIComponent(companyName + ' Listings')}&body=${encodeURIComponent(shareUrl)}`)}
              className="justify-start"
            >
              <Mail className="h-4 w-4 mr-2" /> Email
            </Button>
            <Button
              variant="outline"
              onClick={() => openShare(`sms:&body=${encodeURIComponent(shareUrl)}`)}
              className="justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" /> SMS
            </Button>
            <Button
              variant="outline"
              onClick={() => printShareSheet({
                companyName,
                shareUrl,
                total,
                active,
                avg,
                totalValue,
                featured: listings
              })}
              className="justify-start"
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>
        </div>

        {/* Social Platforms */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Social Platforms</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
              className="justify-start"
            >
              <Facebook className="h-4 w-4 mr-2" /> Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => openShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(companyName + ' listings')}`)}
              className="justify-start"
            >
              <Twitter className="h-4 w-4 mr-2" /> Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}
              className="justify-start"
            >
              <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
            </Button>
          </div>
        </div>

        {/* What's Shared */}
        <div className="rounded-xl border p-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>Total Listings: <span className="font-medium text-foreground">{total}</span></div>
            <div>Active: <span className="font-medium text-foreground">{active}</span></div>
            <div>Average Price: <span className="font-medium text-foreground">${avg.toLocaleString()}</span></div>
            <div>Total Value: <span className="font-medium text-foreground">${totalValue.toLocaleString()}</span></div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Featured: {listings.slice(0, 3).map((l, i) => <span key={l?.id ?? i} className="mr-2">{l?.title || l?.model || l?.make || 'Listing'}</span>)}
            {listings.length > 3 && <span>+{listings.length - 3} more</span>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---- Dashboard view ----
function PropertyListingsDashboard() {
  const navigate = useNavigate()

  // filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'inactive'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'manufactured_home' | 'rv'>('all')
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100k' | '100k-300k' | 'over300k'>('all')

  // share dialog
  const [shareOpen, setShareOpen] = useState(false)

  // stable source
  const listings = ALL_LISTINGS ?? []

  // stats
  const stats = useMemo(() => {
    const total = listings.length
    const active = listings.filter((l) => (l?.status || '').toLowerCase() === 'active').length
    const prices = listings.map(priceOf).filter((n) => Number.isFinite(n) && n > 0)
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
    return { total, active, avgPrice }
  }, [listings])

  // filtered results
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    const withinPrice = (n: number) => {
      if (priceFilter === 'under100k') return n < 100_000
      if (priceFilter === '100k-300k') return n >= 100_000 && n <= 300_000
      if (priceFilter === 'over300k') return n > 300_000
      return true
    }

    return listings.filter((l) => {
      const title = (l?.title || '').toLowerCase()
      const desc = (l?.description || '').toLowerCase()
      const city = (l?.location?.city || '').toLowerCase()
      const make = (l?.make || '').toLowerCase()
      const model = (l?.model || '').toLowerCase()
      const matchesSearch = !q || [title, desc, city, make, model].some((s) => s.includes(q))

      const status = (l?.status || '').toLowerCase()
      const type = (l?.listingType || '').toLowerCase()

      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const matchesType = typeFilter === 'all' || type === typeFilter
      const matchesPrice = withinPrice(priceOf(l))

      return matchesSearch && matchesStatus && matchesType && matchesPrice
    })
  }, [listings, searchTerm, statusFilter, typeFilter, priceFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your property listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShareOpen(true)}>
            <ShareIcon className="h-4 w-4" />
            Share All Listings
          </Button>
          <Button className="flex items-center gap-2" onClick={() => navigate('/property/listings/new')}>
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.active} active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Available for rent/sale</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Find listings fast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufactured_home">Manufactured Home</SelectItem>
                <SelectItem value="rv">RV</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={(v: any) => setPriceFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100k">Under $100K</SelectItem>
                <SelectItem value="100k-300k">$100K – $300K</SelectItem>
                <SelectItem value="over300k">Over $300K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <Card key={listing?.id ?? `${listing?.make}-${listing?.model}`} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={listing?.media?.primaryPhoto || listing?.imageUrl || 'https://picsum.photos/800/450'}
                  alt={listing?.title || listing?.model || 'Listing photo'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={`${statusBadge(listing?.status)} text-white`}>{listing?.status ?? '—'}</Badge>
                  <Badge className={`${typeBadge(listing?.listingType)} text-white`}>
                    {(listing?.listingType || '').toLowerCase() === 'manufactured_home' ? 'MH' : 'RV'}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">{formatPrice(listing)}</Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{listing?.title || `${listing?.year ?? ''} ${listing?.make ?? ''} ${listing?.model ?? ''}`}</h3>
                  <p className="text-sm text-muted-foreground">
                    {listing?.year ? `${listing.year} ` : ''}{listing?.make} {listing?.model}
                  </p>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {(listing?.location?.city || '—')}, {(listing?.location?.state || '')}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {(listing?.listingType || '').toLowerCase() === 'manufactured_home' ? (
                      <>
                        {Number.isFinite(Number(listing?.bedrooms)) && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {listing.bedrooms}
                          </div>
                        )}
                        {Number.isFinite(Number(listing?.bathrooms)) && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {listing.bathrooms}
                          </div>
                        )}
                        {Number.isFinite(Number(listing?.dimensions?.squareFeet)) && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            {listing.dimensions.squareFeet} sq ft
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {Number.isFinite(Number(listing?.sleeps)) && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Sleeps {listing.sleeps}
                          </div>
                        )}
                        {Number.isFinite(Number(listing?.dimensions?.length)) && (
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-1" />
                            {listing.dimensions.length} ft
                          </div>
                        )}
                        {Number.isFinite(Number(listing?.slides)) && (
                          <div className="flex items-center">
                            <span className="text-xs mr-1">📐</span>
                            {listing.slides} slides
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/property/listings/${listing?.id ?? ''}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/property/listings/${listing?.id ?? ''}?edit=1`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('Delete not implemented in mock')}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => navigate('/property/listings/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share dialog */}
      <ShareAllListingsDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        companyName="Demo RV Dealership"
        companySlug="demo"
        total={stats.total}
        active={stats.active}
        avg={stats.avgPrice}
        listings={listings}
      />
    </div>
  )
}

// ---- Routed wrapper ----
export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<PropertyListingsDashboard />} />
      <Route path="*" element={<PropertyListingsDashboard />} />
    </Routes>
  )
}
