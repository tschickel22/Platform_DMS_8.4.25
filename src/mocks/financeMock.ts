// ✅ Step 1: Declare mockCheckoutAccounts FIRST

export const mockCheckoutAccounts = {
  loans: [
    {
      accountNumber: 'LOAN001',
      customerName: 'John Smith',
      vehicleInfo: '2023 Honda Civic',
      balance: 15000,
      monthlyPayment: 350,
      nextDueDate: '2024-02-15',
      status: 'current',
    },
    {
      accountNumber: 'LOAN002',
      customerName: 'Sarah Johnson',
      vehicleInfo: '2022 Toyota Camry',
      balance: 22500,
      monthlyPayment: 425,
      nextDueDate: '2024-02-10',
      status: 'past_due',
    },
    {
      accountNumber: 'test',
      customerName: 'Test Customer',
      vehicleInfo: '2024 Test Vehicle',
      balance: 9000,
      monthlyPayment: 250,
      nextDueDate: '2024-02-01',
      status: 'current',
    },
  ],
  invoices: [
    {
      accountNumber: 'INV001',
      customerName: 'Mike Wilson',
      invoiceNumber: 'INV-2024-001',
      amount: 1250,
      dueDate: '2024-02-05',
      description: 'Vehicle Service & Maintenance',
      status: 'overdue',
    },
    {
      accountNumber: 'INV002',
      customerName: 'Lisa Brown',
      invoiceNumber: 'INV-2024-002',
      amount: 850,
      dueDate: '2024-02-20',
      description: 'Parts & Labor',
      status: 'pending',
    },
    {
      accountNumber: 'test',
      customerName: 'Test Customer',
      invoiceNumber: 'INV-2024-TEST',
      amount: 500,
      dueDate: '2024-02-15',
      description: 'Test Invoice Description',
      status: 'pending',
    },
  ],
  checkoutAccounts: {}, // Avoid circular reference
};

// ✅ Step 2: Define mockFinance AFTER mockCheckoutAccounts

export const mockFinance = {
  termOptions: [12, 24, 36, 48, 60, 72],
  interestRates: [5.0, 6.5, 7.25, 8.0, 9.99],
  paymentFrequencies: ['Monthly', 'Bi-Weekly', 'Weekly'],
  statusOptions: ['Current', 'Late', 'Default', 'Paid Off'],

  defaultLoan: {
    amount: 25000,
    rate: 7.25,
    termMonths: 60,
    downPayment: 3000,
    startDate: '2023-01-01',
  },

  sampleLoans: [
    {
      id: 'loan-001',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      vehicleId: 'vh-001',
      vehicleInfo: '2020 Forest River Cherokee 274RK',
      loanAmount: 45000,
      downPayment: 5000,
      interestRate: 7.25,
      termMonths: 60,
      monthlyPayment: 895.5,
      startDate: '2023-06-15T00:00:00Z',
      status: 'Current',
      remainingBalance: 38750,
      nextPaymentDate: '2024-02-15T00:00:00Z',
      totalPaid: 11250,
      paymentsRemaining: 43,
      createdAt: '2023-06-10T14:30:00Z',
      updatedAt: '2024-01-15T09:20:00Z',
    },
    {
      id: 'loan-002',
      customerId: 'cust-002',
      customerName: 'Maria Rodriguez',
      customerEmail: 'maria.rodriguez@email.com',
      customerPhone: '(555) 987-6543',
      vehicleId: 'vh-002',
      vehicleInfo: '2019 Keystone Montana 3761FL',
      loanAmount: 62000,
      downPayment: 8000,
      interestRate: 6.5,
      termMonths: 72,
      monthlyPayment: 1025.75,
      startDate: '2023-03-01T00:00:00Z',
      status: 'Current',
      remainingBalance: 51200,
      nextPaymentDate: '2024-02-01T00:00:00Z',
      totalPaid: 18900,
      paymentsRemaining: 61,
      createdAt: '2023-02-25T11:15:00Z',
      updatedAt: '2024-01-01T16:45:00Z',
    },
  ],

  samplePayments: [
    {
      id: 'pmt-001',
      loanId: 'loan-001',
      paymentDate: '2024-01-15T00:00:00Z',
      amount: 895.5,
      principalAmount: 645.3,
      interestAmount: 250.2,
      status: 'Completed',
      paymentMethod: 'ACH',
      transactionId: 'TXN-20240115-001',
      processedDate: '2024-01-15T08:30:00Z',
      notes: 'Automatic payment processed successfully',
    },
    {
      id: 'pmt-002',
      loanId: 'loan-001',
      paymentDate: '2023-12-15T00:00:00Z',
      amount: 895.5,
      principalAmount: 641.85,
      interestAmount: 253.65,
      status: 'Completed',
      paymentMethod: 'ACH',
      transactionId: 'TXN-20231215-001',
      processedDate: '2023-12-15T08:30:00Z',
      notes: 'Automatic payment processed successfully',
    },
    {
      id: 'pmt-003',
      loanId: 'loan-002',
      paymentDate: '2024-01-01T00:00:00Z',
      amount: 1025.75,
      principalAmount: 692.4,
      interestAmount: 333.35,
      status: 'Completed',
      paymentMethod: 'Check',
      transactionId: 'CHK-20240101-002',
      processedDate: '2024-01-02T10:15:00Z',
      notes: 'Check payment deposited',
    },
    {
      id: 'pmt-004',
      loanId: 'loan-001',
      paymentDate: '2024-02-15T00:00:00Z',
      amount: 895.5,
      principalAmount: 648.8,
      interestAmount: 246.7,
      status: 'Pending',
      paymentMethod: 'ACH',
      transactionId: null,
      processedDate: null,
      notes: 'Scheduled automatic payment',
    },
  ],

  formDefaults: {
    loanAmount: 25000,
    downPayment: 3000,
    interestRate: 7.25,
    termMonths: 60,
    paymentFrequency: 'Monthly',
    startDate: '',
    customerId: '',
    vehicleId: '',
    notes: '',
  },

  paymentMethods: ['ACH', 'Check', 'Credit Card', 'Cash', 'Wire Transfer'],

  loanTypes: ['Purchase', 'Refinance', 'Equity'],

  statusColors: {
    Current: 'bg-green-100 text-green-800',
    Late: 'bg-yellow-100 text-yellow-800',
    Default: 'bg-red-100 text-red-800',
    'Paid Off': 'bg-blue-100 text-blue-800',
  },

  paymentStatusColors: {
    Completed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800',
    Cancelled: 'bg-gray-100 text-gray-800',
  },

  calculatorDefaults: {
    loanAmount: 25000,
    downPayment: 3000,
    interestRate: 7.25,
    termMonths: 60,
  },

  amortizationSample: [
    {
      paymentNumber: 1,
      paymentDate: '2024-02-15',
      paymentAmount: 895.5,
      principalAmount: 645.3,
      interestAmount: 250.2,
      remainingBalance: 24354.7,
    },
    {
      paymentNumber: 2,
      paymentDate: '2024-03-15',
      paymentAmount: 895.5,
      principalAmount: 648.85,
      interestAmount: 246.65,
      remainingBalance: 23705.85,
    },
    {
      paymentNumber: 3,
      paymentDate: '2024-04-15',
      paymentAmount: 895.5,
      principalAmount: 652.42,
      interestAmount: 243.08,
      remainingBalance: 23053.43,
    },
  ],

  checkoutAccounts: mockCheckoutAccounts,
};

// ✅ Step 3: Export mockFinance as default
export default mockFinance;

// ✅ Step 4: Export mockFinanceData alias for compatibility
export const mockFinanceData = mockFinance;
