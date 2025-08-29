import type { ComponentType } from 'react'
import AccountInvoicesSection from './components/AccountInvoicesSection'

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

const descriptor: AccountSectionDescriptor = {
  id: 'invoices',
  type: 'invoices',
  title: 'Invoices',
  description: 'Invoices for this account',
  component: AccountInvoicesSection,
  sort: 66,            // after Payments
  defaultVisible: true,
}

export default descriptor
