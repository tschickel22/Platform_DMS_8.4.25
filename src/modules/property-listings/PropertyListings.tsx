import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ListingsWorkspace from './components/ListingsWorkspace'
import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'

export default function PropertyListings() {
  return (
    <div className="flex h-full flex-col">
      <Routes>
        <Route path="/" element={<ListingsWorkspace />} />
        <Route path="/overview" element={<ListingOverview />} />
        <Route path="/new" element={<ListingForm />} />
        <Route path="/edit/:id" element={<ListingForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
