import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandDashboard from './components/LandDashboard'
import LandList from './components/LandList'
import LandForm from './components/LandForm'
import LandDetail from './components/LandDetail'

export default function LandManagement() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<LandDashboard />} />
        <Route path="/list" element={<LandList />} />
        <Route path="/new" element={<LandForm />} />
        <Route path="/edit/:id" element={<LandForm />} />
        <Route path="/detail/:id" element={<LandDetail />} />
      </Routes>
    </div>
  )
}