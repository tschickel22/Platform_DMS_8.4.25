import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ListingOverview from './components/ListingOverview'
import ListingForm from './components/ListingForm'
import ListingDetail from './components/ListingDetail'

export default function PropertyListings() {
  return (
    <Routes>
      <Route path="/" element={<ListingOverview />} />
      <Route path="/new" element={<ListingForm />} />
      <Route path="/edit/:id" element={<ListingForm />} />
      <Route path="/:id" element={<ListingDetail />} />
      <Route path="*" element={<Navigate to="/listings/" replace />} />
    </Routes>
  )
}