// src/modules/agreement-vault/account-section.tsx
import AccountAgreementsSection from './components/AccountAgreementsSection'

export default {
  id: 'agreements',
  type: 'agreements' as const,
  title: 'Agreements',
  description: 'Contracts and signed agreements linked to this account',
  defaultVisible: true,
  sort: 60,
  component: AccountAgreementsSection, // reference, not <AccountAgreementsSection />
}
