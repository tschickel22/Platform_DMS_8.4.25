import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'
import SyndicationGenerator from './components/SyndicationGenerator'

// 🚧 Temporary test listings (replace with Supabase in production)
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
    images: 1
  }
]

export default function PropertyListings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' || listing.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">Property Listings</h1>
      </div>

      <Routes>
        <Route path="/" element={<ListingOverview listings={filteredListings} />} />
        <Route path="new" element={<ListingForm />} />
        <Route path="edit/:id" element={<ListingForm />} />
        <Route path="syndication" element={<SyndicationGenerator />} />
        <Route path=":id" element={<ListingDetail />} />
      </Routes>
    </div>
  )
}
