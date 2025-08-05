import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandList from './components/LandList'
import LandForm from './components/LandForm'
import LandDetail from './components/LandDetail'

export default function LandManagement() {
  return (
    <div className="space-y-6">
      <Routes>
        {/* Main land list view */}
        <Route path="/" element={<LandList />} />
        
        {/* Create new land record */}
        <Route path="/new" element={<LandForm />} />
        
        {/* Edit existing land record */}
        <Route path="/edit/:id" element={<LandForm />} />
        
        {/* View land record details */}
        <Route path="/:id" element={<LandDetail />} />
        
        {/* Redirect any unmatched routes to the main list */}
        <Route path="*" element={<Navigate to="/land" replace />} />
      </Routes>
    </div>
  )
}