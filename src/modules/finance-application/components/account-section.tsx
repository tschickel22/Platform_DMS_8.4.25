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

// Keep the section’s UI in this module so we don’t touch core files
import AccountApplicationsSection from './components/AccountApplicationsSection'

const descriptor: AccountSectionDescriptor = {
  id: 'applications',
  type: 'applications',
  title: 'Finance Applications',
  description: 'Credit/loan applications for this account',
  component: AccountApplicationsSection,
  sort: 65,         // after Payments (60) and before Invoices (66)
  defaultVisible: true,
}

export default descriptor
