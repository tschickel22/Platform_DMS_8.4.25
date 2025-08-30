// src/modules/finance-application/components/account-section.tsx
import type { ComponentType } from 'react'

type SectionType =
  | 'contacts' | 'deals' | 'quotes' | 'service' | 'deliveries'
  | 'warranty' | 'payments' | 'agreements' | 'applications'
  | 'invoices' | 'notes'

export interface AccountSectionDescriptor {
  id: string
  type: SectionType
  title: string
  description: string
  component: ComponentType<any>
  sort?: number
  defaultVisible?: boolean
}

// This file is already inside .../components/, so import the sibling directly
import AccountApplicationsSection from './AccountApplicationsSection'

const descriptor: AccountSectionDescriptor = {
  id: 'applications',
  type: 'applications',
  title: 'Finance Applications',
  description: 'Credit/loan applications for this account',
  component: AccountApplicationsSection,
  sort: 65, // after Payments (60) and before Invoices (66)
  defaultVisible: true,
}

export default descriptor
