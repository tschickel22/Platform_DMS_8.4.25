import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Edit,
  Copy,
  Play,
  Pause,
  Trash2,
  Share,
  Eye,
  FileImage,
  DollarSign
} from 'lucide-react'

interface Listing {
  id: string
  companyId: string
  inventoryId: string
  listingType: 'manufactured_home' | 'rv'
  offerType: 'for_sale' | 'for_rent' | 'both'
  status: 'active' | 'paused' | 'removed' | 'draft'
  title?: string
  salePrice?: number
  rentPrice?: number
  description?: string
  searchResultsText?: string
  media?: {
    photos: string[]
    primaryPhoto?: string
  }
  location?: {
    city?: string
    state?: string
    postalCode?: string
  }
  make?: string
  model?: string
  year?: number
  bedrooms?: number
  bathrooms?: number
  createdAt: string
  updatedAt: string
  lastExported?: string
  activePartnersCount?: number
}

interface ListingOverviewProps {
  listings: Listing[]
  onEdit: (listing: Listing) => void
  onClone: (listing: Listing) => void
  onToggleStatus: (listing: Listing) => void
  onRemove: (listing: Listing) => void
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default'
    case 'paused':
      return 'secondary'
    case 'draft':
      return 'outline'
    case 'removed':
      return 'destructive'
    default:
      return 'outline'
  }
}

const formatPrice = (price?: number) => {
  if (!price) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getListingTitle = (listing: Listing) => {
  if (listing.title) return listing.title
  
  const year = listing.year || 'Unknown'
  const make = listing.make || 'Unknown'
  const model = listing.model || 'Model'
  
  return `${year} ${make} ${model}`
}

export function ListingOverview({ listings, onEdit, onClone, onToggleStatus, onRemove }: ListingOverviewProps) {
  const handleShare = (listing: Listing) => {
    // TODO: Implement sharing functionality
    console.log('Share listing:', listing.id)
  }

  const handlePreview = (listing: Listing) => {
    // TODO: Open feed preview
    console.log('Preview feed for listing:', listing.id)
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Partners</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {listing.media?.primaryPhoto ? (
                      <img
                        src={listing.media.primaryPhoto}
                        alt={getListingTitle(listing)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {getListingTitle(listing)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {listing.inventoryId}
                    </div>
                    {listing.location?.city && listing.location?.state && (
                      <div className="text-xs text-muted-foreground">
                        {listing.location.city}, {listing.location.state}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {listing.listingType === 'manufactured_home' ? 'MH' : 'RV'}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    {listing.offerType === 'for_sale' && (
                      <Badge variant="secondary" className="text-xs">Sale</Badge>
                    )}
                    {listing.offerType === 'for_rent' && (
                      <Badge variant="secondary" className="text-xs">Rent</Badge>
                    )}
                    {listing.offerType === 'both' && (
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">Sale</Badge>
                        <Badge variant="secondary" className="text-xs">Rent</Badge>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1 text-sm">
                    {(listing.offerType === 'for_sale' || listing.offerType === 'both') && listing.salePrice && (
                      <div className="flex items-center text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatPrice(listing.salePrice)}
                      </div>
                    )}
                    {(listing.offerType === 'for_rent' || listing.offerType === 'both') && listing.rentPrice && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatPrice(listing.rentPrice)}/mo
                      </div>
                    )}
                    {!listing.salePrice && !listing.rentPrice && (
                      <span className="text-xs text-muted-foreground">No price set</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    {listing.activePartnersCount || 0}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(listing.status)}>
                    {listing.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(listing.updatedAt)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(listing)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onClone(listing)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(listing)}>
                        {listing.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleShare(listing)}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePreview(listing)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Feed Preview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onRemove(listing)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}