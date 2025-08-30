import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { TagManager } from './components/TagManager'
import { TagFilter } from './components/TagFilter'
import { BulkTagOperations } from './components/BulkTagOperations'

function TaggingEngineMain() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  
  return <TagManager activeFilter={activeFilter} onFilterChange={setActiveFilter} />
}

export default function TaggingEngine() {
  return (
    <Routes>
      <Route path="/" element={<TaggingEngineMain />} />
      <Route path="/*" element={<TaggingEngineMain />} />
    </Routes>
  )
}

// Export components for use in other modules
export { TagSelector } from './components/TagSelector'
export { TagFilter } from './components/TagFilter'
export { BulkTagOperations } from './components/BulkTagOperations'
export { useTagging } from './hooks/useTagging'
export * from './types'