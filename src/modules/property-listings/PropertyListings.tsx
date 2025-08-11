import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ListingOverview from './components/ListingOverview'

export default function PropertyListings() {
  return (
    <div className="flex flex-col h-full">
      <Routes>
        <Route path="/" element={<ListingOverview />} />
        <Route path="/*" element={<ListingOverview />} />
      </Routes>
    </div>
  )
}