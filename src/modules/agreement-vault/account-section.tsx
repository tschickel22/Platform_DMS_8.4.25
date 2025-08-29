// src/modules/agreement-vault/account-section.tsx
import type { ComponentType } from 'react'
import AccountAgreementsSection from './components/AccountAgreementsSection'

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
  id: 'agreements',
  type: 'agreements',
  title: 'Agreements',
  description: 'Recorded agreements for this account',
  component: AccountAgreementsSection as ComponentType<any>,
  sort: 64,
  defaultVisible: true,
}

export default descriptor
