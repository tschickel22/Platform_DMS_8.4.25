import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ListingOverview from './components/ListingOverview'

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<ListingOverview />} />
    </Routes>
  )
}