// Mock data for Finance Applications
export const mockFinanceApplications = {
  sampleApplications: [
    {
      id: 'app-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      status: 'pending_review',
      idvStatus: 'verified',
      applicationDate: '2024-01-10',
      submittedDate: '2024-01-12',
      updatedAt: '2024-01-15',
      loanAmount: 45000,
      vehicleInfo: {
        year: 2023,
        make: 'Forest River',
        model: 'Cherokee',
        vin: '1FTFW1ET5DFC12345'
      },
      documents: [
        { name: 'Driver License', status: 'approved', uploadDate: '2024-01-10' },
        { name: 'Income Verification', status: 'pending', uploadDate: '2024-01-11' }
      ],
      creditScore: 720,
      monthlyIncome: 5500,
      employmentStatus: 'employed',
      notes: 'Customer has excellent credit history'
    },
    {
      id: 'app-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '(555) 234-5678',
      status: 'draft',
      idvStatus: 'pending',
      applicationDate: '2024-01-18',
      submittedDate: null,
      updatedAt: '2024-01-20',
      loanAmount: 32000,
      vehicleInfo: {
        year: 2022,
        make: 'Keystone',
        model: 'Passport',
        vin: '1FTFW1ET5DFC67890'
      },
      documents: [
        { name: 'Driver License', status: 'pending', uploadDate: '2024-01-18' }
      ],
      creditScore: null,
      monthlyIncome: 4200,
      employmentStatus: 'employed',
      notes: 'Application in progress'
    },
    {
      id: 'app-003',
      customerId: 'cust-003',
      customerName: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '(555) 345-6789',
      status: 'submitted',
      idvStatus: 'pending',
      applicationDate: '2024-01-20',
      submittedDate: '2024-01-22',
      updatedAt: '2024-01-22',
      loanAmount: 28000,
      vehicleInfo: {
        year: 2021,
        make: 'Winnebago',
        model: 'Micro Minnie',
        vin: '1FTFW1ET5DFC11111'
      },
      documents: [
        { name: 'Driver License', status: 'approved', uploadDate: '2024-01-20' },
        { name: 'Income Verification', status: 'approved', uploadDate: '2024-01-21' },
        { name: 'Bank Statements', status: 'pending', uploadDate: '2024-01-22' }
      ],
      creditScore: 680,
      monthlyIncome: 3800,
      employmentStatus: 'employed',
      notes: 'Ready for review'
    },
    {
      id: 'app-004',
      customerId: 'cust-004',
      customerName: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phone: '(555) 456-7890',
      status: 'pending_review',
      idvStatus: 'flagged',
      applicationDate: '2024-01-25',
      submittedDate: '2024-01-26',
      updatedAt: '2024-01-28',
      loanAmount: 55000,
      vehicleInfo: {
        year: 2024,
        make: 'Airstream',
        model: 'Flying Cloud',
        vin: '1FTFW1ET5DFC22222'
      },
      documents: [
        { name: 'Driver License', status: 'approved', uploadDate: '2024-01-25' },
        { name: 'Income Verification', status: 'flagged', uploadDate: '2024-01-26' }
      ],
      creditScore: 650,
      monthlyIncome: 6200,
      employmentStatus: 'self-employed',
      notes: 'Income verification needs additional documentation'
    },
    {
      id: 'app-005',
      customerId: 'cust-005',
      customerName: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '(555) 567-8901',
      status: 'denied',
      idvStatus: 'flagged',
      applicationDate: '2024-01-12',
      submittedDate: '2024-01-14',
      updatedAt: '2024-01-16',
      loanAmount: 38000,
      vehicleInfo: {
        year: 2020,
        make: 'Thor',
        model: 'Four Winds',
        vin: '1FTFW1ET5DFC33333'
      },
      documents: [
        { name: 'Driver License', status: 'approved', uploadDate: '2024-01-12' },
        { name: 'Income Verification', status: 'rejected', uploadDate: '2024-01-13' }
      ],
      creditScore: 580,
      monthlyIncome: 2800,
      employmentStatus: 'unemployed',
      notes: 'Application denied due to insufficient income and poor credit'
    },
    {
      id: 'app-006',
      customerId: 'cust-006',
      customerName: 'Lisa Chen',
      email: 'lisa.chen@email.com',
      phone: '(555) 678-9012',
      status: 'approved',
      idvStatus: 'verified',
      applicationDate: '2024-01-08',
      submittedDate: '2024-01-09',
      updatedAt: '2024-01-11',
      loanAmount: 42000,
      vehicleInfo: {
        year: 2023,
        make: 'Grand Design',
        model: 'Imagine',
        vin: '1FTFW1ET5DFC44444'
      },
      documents: [
        { name: 'Driver License', status: 'approved', uploadDate: '2024-01-08' },
        { name: 'Income Verification', status: 'approved', uploadDate: '2024-01-09' },
        { name: 'Bank Statements', status: 'approved', uploadDate: '2024-01-09' }
      ],
      creditScore: 750,
      monthlyIncome: 7200,
      employmentStatus: 'employed',
      notes: 'Excellent candidate, approved for full amount'
    }
  ]
}

export default mockFinanceApplications