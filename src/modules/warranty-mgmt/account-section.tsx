import { AccountWarrantySection } from '@/modules/accounts/components/AccountWarrantySection'

export default {
  id: 'warranty',
  type: 'warranty',
  title: 'Warranty',
  description: 'Warranty registrations and coverage',
  component: AccountWarrantySection,
  sort: 60,
  defaultVisible: true,
} as const
