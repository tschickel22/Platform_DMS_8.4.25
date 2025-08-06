import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Home,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Share2,
  Building,
  Search,
  Filter,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'
import { ShareAllListingsModal } from './components/ShareAllListingsModal'
import { mockListings } from '@/mocks/listingsMock'

interface Listing {
  id: string
  title: string
  description: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  status: 'active' | 'pending' | 'rented' | 'inactive'
  images: string[]
  // …other fields…
}

function PropertyListingsDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>(mockListings.sampleListings)
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  // …filters & stats calculation…

  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
    toast({ title: 'Success', description: 'Listing deleted' })
  }

  return (
    <div className="space-y-6">
      {/* Header, Stats, Filters… */}

      {/* All Listings */}
      <Card>
        <CardHeader>
          <CardTitle>All Listings ({listings.length})</CardTitle>
          <CardDescription>
            {/* description */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No listings found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                // START of one card
                <Card
                  key={listing.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* image + badges */}
                  <div className="aspect-video relative">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                      onClick={() => navigate(`/listings/detail/${listing.id}`)}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="capitalize">
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/50 text-white border-0">
                        ${listing.rent}/month
                      </Badge>
                    </div>
                  </div>
                  {/* DETAILS */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="mr-1 h-4 w-4" />
                      {listing.address}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex space-x-3">
                        <span>{listing.bedrooms} bed</span>
                        <span>{listing.bathrooms} bath</span>
                        <span>{listing.squareFootage} ft²</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {listing.propertyType}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/listings/detail/${listing.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/listings/edit/${listing.id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                // END of one card
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ShareAllListingsModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listings={listings}
      />
    </div>
  )
}

function PropertyListings() {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<PropertyListingsDashboard />} />
        <Route path="/overview" element={<ListingOverview />} />
        <Route path="/new" element={<ListingForm />} />
        <Route path="/edit/:id" element={<ListingForm />} />
        <Route path="/detail/:id" element={<ListingDetail />} />
      </Routes>
    </div>
  )
}

export default PropertyListings
