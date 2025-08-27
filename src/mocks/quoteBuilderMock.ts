import { mockAccounts } from './accountsMock'
import { mockContacts } from './contactsMock'

export const mockQuoteBuilder = {
  termLengths: [12, 24, 36, 48, 60, 72],
  interestRates: [5.99, 6.99, 7.99, 9.99],
  paymentFrequencies: ['Monthly', 'Bi-Weekly', 'Weekly'],
  defaultDownPayments: [0, 500, 1000, 1500],
  dealerFees: ['Document Fee', 'Prep Fee', 'Delivery Fee'],
  templates: [
    {
      name: 'Standard Quote',
      description: 'Includes base unit, delivery, and standard fees.'
    },
    {
      name: 'Promo Offer',
      description: 'Includes discount and waived delivery fee.'
    }
  ],
  
  // Added sampleQuotes to match the Quote interface and link to accounts/contacts
  sampleQuotes: [
    {
      id: 'quote-001',
      customerId: 'cust-001',
      accountId: mockAccounts[3].id, // Smith Family Trust
      contactId: mockContacts[4].id, // John Smith
      vehicleId: 'veh-001',
      items: [
        { id: 'item-001', description: '2023 Forest River Cherokee 274RK', quantity: 1, unitPrice: 35000, total: 35000 },
        { id: 'item-002', description: 'Document Fee', quantity: 1, unitPrice: 250, total: 250 }
      ],
      subtotal: 35250,
      tax: 2115,
      total: 37365,
      status: 'SENT',
      validUntil: new Date('2024-08-15T17:00:00Z'),
      notes: 'Customer interested in quick close.',
      customFields: {},
      createdAt: new Date('2024-07-10T10:00:00Z'),
      updatedAt: new Date('2024-07-10T10:00:00Z')
    },
    {
      id: 'quote-002',
      customerId: 'cust-002',
      accountId: mockAccounts[1].id, // Mobile Home Solutions
      contactId: mockContacts[1].id, // Bob Johnson
      vehicleId: 'veh-002',
      items: [
        { id: 'item-003', description: '2024 Keystone Montana 3761FL', quantity: 1, unitPrice: 62000, total: 62000 },
        { id: 'item-004', description: 'Prep Fee', quantity: 1, unitPrice: 500, total: 500 }
      ],
      subtotal: 62500,
      tax: 3750,
      total: 66250,
      status: 'DRAFT',
      validUntil: new Date('2024-09-01T17:00:00Z'),
      notes: 'Waiting for customer financing approval.',
      customFields: {},
      createdAt: new Date('2024-07-12T14:00:00Z'),
      updatedAt: new Date('2024-07-12T14:00:00Z')
    }
  ]
}

export default mockQuoteBuilder