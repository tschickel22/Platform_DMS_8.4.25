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
  
  sampleQuotes: [
    {
      id: 'quote-001',
      number: 'Q-2024-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      accountId: 'acc-001',
      contactId: 'con-001',
      vehicleId: 'veh-001',
      vehicleInfo: '2023 Forest River Cherokee 274RK',
      amount: 35000,
      status: 'sent',
      validUntil: '2024-02-15T00:00:00Z',
      items: [
        { id: 'item-001', description: '2023 Forest River Cherokee 274RK', quantity: 1, unitPrice: 32000, total: 32000 },
        { id: 'item-002', description: 'Delivery Fee', quantity: 1, unitPrice: 500, total: 500 },
        { id: 'item-003', description: 'Setup Fee', quantity: 1, unitPrice: 2500, total: 2500 }
      ],
      subtotal: 35000,
      tax: 0,
      total: 35000,
      notes: 'Customer interested in financing options',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'quote-002',
      number: 'Q-2024-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      accountId: 'acc-002',
      contactId: 'con-002',
      vehicleId: 'veh-002',
      vehicleInfo: '2024 Keystone Montana 3761FL',
      amount: 62000,
      status: 'pending',
      validUntil: '2024-02-28T00:00:00Z',
      items: [
        { id: 'item-004', description: '2024 Keystone Montana 3761FL', quantity: 1, unitPrice: 60000, total: 60000 },
        { id: 'item-005', description: 'Extended Warranty', quantity: 1, unitPrice: 2000, total: 2000 }
      ],
      subtotal: 62000,
      tax: 0,
      total: 62000,
      notes: 'Lease agreement quote',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T11:00:00Z'
    },
    {
      id: 'quote-003',
      number: 'Q-2024-003',
      customerId: 'cust-003',
      customerName: 'David Johnson',
      accountId: 'acc-003',
      contactId: 'con-003',
      vehicleId: 'veh-003',
      vehicleInfo: '2022 Grand Design Solitude 310GK',
      amount: 48000,
      status: 'accepted',
      validUntil: '2024-01-31T00:00:00Z',
      items: [
        { id: 'item-006', description: '2022 Grand Design Solitude 310GK', quantity: 1, unitPrice: 45000, total: 45000 },
        { id: 'item-007', description: 'Service Package', quantity: 1, unitPrice: 3000, total: 3000 }
      ],
      subtotal: 48000,
      tax: 0,
      total: 48000,
      notes: 'Service agreement quote - accepted',
      createdAt: '2023-12-20T13:30:00Z',
      updatedAt: '2024-01-05T16:45:00Z'
    }
  ]
}

export default mockQuoteBuilder