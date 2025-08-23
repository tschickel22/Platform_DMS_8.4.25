export const mockFinanceApplications = {
  sampleApplications: [
    {
      id: 'app-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      vehicleId: 'veh-001',
      vehicleInfo: '2023 Forest River Cherokee 274RK',
      applicationType: 'Purchase Financing',
      requestedAmount: 45000,
      downPayment: 5000,
      status: 'approved',
      submittedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-18T14:30:00Z',
      approvedAmount: 45000,
      interestRate: 7.25,
      termMonths: 60,
      monthlyPayment: 895.50,
      notes: 'Application approved with standard terms',
      documents: [
        { id: 'doc-001', name: 'Application Form.pdf', type: 'application/pdf', uploadedAt: '2024-01-15T10:00:00Z' },
        { id: 'doc-002', name: 'Income Verification.pdf', type: 'application/pdf', uploadedAt: '2024-01-15T10:15:00Z' }
      ]
    },
    {
      id: 'app-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerEmail: 'maria.rodriguez@email.com',
      vehicleId: 'veh-002',
      vehicleInfo: '2024 Keystone Montana 3761FL',
      applicationType: 'Lease Financing',
      requestedAmount: 62000,
      downPayment: 8000,
      status: 'under_review',
      submittedAt: '2024-01-20T09:30:00Z',
      updatedAt: '2024-01-22T11:45:00Z',
      notes: 'Application under review by finance team',
      documents: [
        { id: 'doc-003', name: 'Lease Application.pdf', type: 'application/pdf', uploadedAt: '2024-01-20T09:30:00Z' }
      ]
    },
    {
      id: 'app-003',
      customerId: 'cust-003',
      customerName: 'David Johnson',
      customerEmail: 'david.johnson@email.com',
      vehicleId: 'veh-003',
      vehicleInfo: '2022 Grand Design Solitude 310GK',
      applicationType: 'Refinancing',
      requestedAmount: 48000,
      status: 'more_info_needed',
      submittedAt: '2024-01-18T14:20:00Z',
      updatedAt: '2024-01-23T16:10:00Z',
      notes: 'Additional income documentation required',
      documents: [
        { id: 'doc-004', name: 'Refinance Application.pdf', type: 'application/pdf', uploadedAt: '2024-01-18T14:20:00Z' }
      ]
    }
  ],

  applicationTypes: [
    'Purchase Financing',
    'Lease Financing',
    'Refinancing',
    'Trade-in Financing'
  ],

  statusOptions: [
    'draft',
    'submitted',
    'under_review',
    'more_info_needed',
    'approved',
    'rejected'
  ],

  formDefaults: {
    applicationType: 'Purchase Financing',
    requestedAmount: 50000,
    downPayment: 5000,
    termMonths: 60,
    status: 'draft'
  }
}

export default mockFinanceApplications