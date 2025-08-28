import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ContactList from './pages/ContactList'
import ContactDetail from './pages/ContactDetail'
import ContactForm from './components/ContactForm'

export default function ContactsModule() {
  return (
    <Routes>
      <Route path="/" element={<ContactList />} />
      <Route path="/new" element={<ContactForm />} />
      <Route path="/:contactId" element={<ContactDetail />} />
      <Route path="/:contactId/edit" element={<ContactForm />} />
      <Route path="*" element={<Navigate to="/contacts" replace />} />
    </Routes>
  )
}