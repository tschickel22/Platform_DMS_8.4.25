import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WebsiteBuilder from './WebsiteBuilder'

export function WebsiteBuilderRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteBuilder />} />
      <Route path="/*" element={<WebsiteBuilder />} />
    </Routes>
  )
}

export function CompanyWebsiteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteBuilder />} />
      <Route path="/*" element={<WebsiteBuilder />} />
    </Routes>
  )
}