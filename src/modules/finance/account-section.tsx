import type { ComponentType } from 'react'
import { AccountPaymentsSection } from '@/modules/accounts/components/AccountPaymentsSection'

type SectionType =
  | 'contacts'
  | 'deals'
  | 'quotes'
  | 'service'
  | 'deliveries'
  | 'warranty'
  | 'payments'
  | 'agreements'
  | 'applications'
  | 'invoices'
  | 'notes'

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
  id: 'payments',
  type: 'payments',
  title: 'Payments',
  description: 'Recorded payments for this account',
  component: AccountPaymentsSection,
  sort: 60,             // appears after Deliveries/Warranty
  defaultVisible: true, // include by default
}

export default descriptor
