export const mockFinanceApplications = {
  sampleApplications: [
    {
      id: 'app-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      loanAmount: 45000,
      downPayment: 5000,
      termMonths: 60,
      status: 'approved',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'app-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerEmail: 'maria.rodriguez@email.com',
      loanAmount: 62000,
      downPayment: 8000,
      termMonths: 72,
      status: 'under_review',
      createdAt: '2024-01-18T11:30:00Z',
      updatedAt: '2024-01-22T09:15:00Z'
    }
  ]
}

export default mockFinanceApplications