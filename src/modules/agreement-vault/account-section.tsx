import React from 'react'
import AccountAgreementsSection from './components/AccountAgreementsSection' // default import

/**
 * Dynamic Account section descriptor for Agreements.
 * Keeps "Agreements" visible on AccountDetail and wires the "Create Agreement" button.
 */
const descriptor = {
  id: 'agreements',
  type: 'agreements' as const,
  title: 'Agreements',
  description: 'Contracts and signed agreements linked to this account',
  defaultVisible: true,
  sort: 60,
  // IMPORTANT: provide a React *element*, not a component type
  component: <AccountAgreementsSection />,
}

export default descriptor
