import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AccountList from './pages/AccountList'
import AccountDetail from './pages/AccountDetail'
import AccountForm from './components/AccountForm'

export default function AccountsModule() {
  return (
    <Routes>
      <Route path="/" element={<AccountList />} />
      <Route path="/new" element={<AccountForm />} />
      <Route path="/:accountId" element={<AccountDetail />} />
      <Route path="/:accountId/edit" element={<AccountForm />} />
      <Route path="*" element={<Navigate to="/accounts" replace />} />
    </Routes>
  )
}