// src/modules/agreement-vault/account-section.tsx
// Dynamic Account section descriptor for Agreements.
// Ensures the "Agreements" section appears on AccountDetail and
// the "Create Agreement" button will use the supplied onCreate prop.

import AccountAgreementsSection from './components/AccountAgreementsSection'

const descriptor = {
  id: 'agreements',
  type: 'agreements' as const,
  title: 'Agreements',
  description: 'Contracts and signed agreements linked to this account',
  defaultVisible: true,
  sort: 60,
  component: AccountAgreementsSection,
}

export default descriptor
