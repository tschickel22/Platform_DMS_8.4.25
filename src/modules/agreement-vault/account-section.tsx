import type { ComponentType } from 'react'
import type { AccountSectionDescriptor as Base, SectionType } from '@/modules/accounts/pages/AccountDetail' // type-only import path ok in TS; if it troubles your setup, inline types.
// src/modules/agreement-vault/account-section.tsx
import { AccountAgreementsSection } from './AccountAgreementsSection'



type AccountSectionDescriptor = {
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
  description: 'Retail/lease agreements & service contracts',
  component: AccountAgreementsSection,
  sort: 65, // after Payments
  defaultVisible: true,
}

export default descriptor
