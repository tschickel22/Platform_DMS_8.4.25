import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ListingsWorkspace from './components/ListingsWorkspace'
import ListingOverview from './components/ListingOverview'

export default function PropertyListings() {
  return (
    <div className="flex flex-col h-full">
    <Routes>
      <Route path="/" element={<ListingsWorkspace />} />
      <Route path="/overview" element={<ListingOverview />} />
      <Route path="/new" element={<ListingForm />} />
      <Route path="/edit/:id" element={<ListingForm />} />
    </Routes>
  )
}
  )
}