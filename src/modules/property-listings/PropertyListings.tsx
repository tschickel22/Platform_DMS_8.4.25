import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Building, ListChecks, Plus, Search, MapPin, Home, DollarSign, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import SyndicationGenerator from './components/SyndicationGenerator'

// Mock data for property listings
const mockListings = [
  {
    id: '1',
    title: 'Luxury RV Site - Waterfront',
    type: 'RV Site',
    location: 'Lake View Park, TX',
    price: 850,
    priceType: 'monthly',
    status: 'Available',
    features: ['Waterfront', 'Full Hookups', '50 Amp', 'WiFi'],
    dateAdded: '2024-01-15',
    images: 1
  },
  {
    id: '2',
    title: 'Mobile Home Lot - Corner Unit',
    type: 'Mobile Home Lot',
    location: 'Sunset Community, FL',
    price: 1200,
    priceType: 'monthly',
    status: 'Available',
    features: ['Corner Lot', 'Mature Trees', 'Near Amenities'],
    dateAdded: '2024-01-12',
    images: 3
  },
  {
    id: '3',
    title: 'Premium RV Site - Extended Stay',
    type: 'RV Site',
    location: 'Desert Oasis, AZ',
    price: 950,
    priceType: 'monthly',
    status: 'Occupied',
    features: ['Extended Stay', 'Desert Views', 'Pool Access'],
    dateAdded: '2024-01-10',
    images: 2
  }
]

function PropertyListingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || listing.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'occupied':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">
            Manage your RV sites and mobile home lots
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockListings.length}</div>
            <p className="text-xs text-muted-foreground">
              Active property listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockListings.filter(l => l.status === 'Available').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for occupancy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockListings.filter(l => l.status === 'Occupied').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently rented</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(mockListings.reduce((sum, l) => sum + l.price, 0) / mockListings.length)}
            </div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters/Search */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
          <CardDescription>Browse and manage all property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Listings Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm font-medium">{listing.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${listing.price}/{listing.priceType}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {listing.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {listing.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{listing.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(listing.dateAdded).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Edit className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ListChecks className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No listings found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PropertyListings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Property Listings</h1>
      </div>
      <Routes>
        <Route path="/" element={<PropertyListingsDashboard />} />
        <Route path="new" element={<div>New Listing Form - Coming Soon</div>} />
        <Route path="syndication" element={<SyndicationGenerator />} />
        <Route path=":id" element={<div>Listing Detail - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/listings/" replace />} />
      </Routes>
    </div>
  )
}