import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import ContactList from './pages/ContactList'
import ContactDetail from './pages/ContactDetail'
import ContactForm from './components/ContactForm'

export default function ContactsModule() {
  return (
    <Routes>
      <Route path="/" element={<ContactList />} />
      <Route path="/new" element={<ContactForm />} />
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/:contactId" element={<ContactDetail />} />
      </Routes>
    </ErrorBoundary>
  )
}