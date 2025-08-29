// src/modules/agreement-vault/account-section.tsx
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

// ✅ point at the component inside ./components
import AccountAgreementsSection from './components/AccountAgreementsSection'

const descriptor: AccountSectionDescriptor = {
  id: 'agreements',
  type: 'agreements',
  title: 'Agreements',
  description: 'Contracts and signed documents for this account',
  component: AccountAgreementsSection,
  sort: 61, // after Payments(60), before Applications(65)/Invoices(66)
  defaultVisible: true,
}

export default descriptor
