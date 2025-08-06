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
  }
]
import { Routes, Route } from 'react-router-dom'
import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'
import SyndicationGenerator from './components/SyndicationGenerator'

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
export default function PropertyListings() {
    }
  )
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Property Listings</h1>
      </div>
      <Routes>
    <Routes>
      <Route path="/" element={<ListingOverview />} />
      <Route path="new" element={<ListingForm />} />
      <Route path="edit/:id" element={<ListingForm />} />
      <Route path="syndication" element={<SyndicationGenerator />} />
      <Route path=":id" element={<ListingDetail />} />
    </Routes>
  )
}
  )