import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import AccountList from './pages/AccountList'
import AccountDetail from './pages/AccountDetail'
import AccountForm from './components/AccountForm'

export default function AccountsModule() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AccountList />} />
        <Route path="/new" element={<AccountForm />} />
        <Route path="/:accountId" element={<AccountDetail />} />
      </Routes>
    </ErrorBoundary>
  )
}