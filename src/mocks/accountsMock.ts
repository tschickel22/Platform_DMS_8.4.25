import { Account, AccountType } from '@/types'

export const mockAccounts = {
  sampleAccounts: [
    {
      id: 'acc-001',
      name: 'Smith Family Trust',
      type: AccountType.CUSTOMER,
      industry: 'Personal',
      website: null,
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
      address: {
        street: '123 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'USA'
      },
      notes: 'Long-time customer, prefers email communication. Interested in luxury RVs.',
      tags: ['VIP Customer', 'Luxury Buyer', 'Referral Source'],
      customFields: {
        preferredContactMethod: 'email',
        creditRating: 'Excellent',
        lifetimeValue: 150000
      },
      createdAt: new Date('2023-06-15T10:30:00Z'),
      updatedAt: new Date('2024-01-20T14:22:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'acc-002',
      name: 'Rodriguez Enterprises',
      type: AccountType.CUSTOMER,
      industry: 'Construction',
      website: 'https://rodriguezenterprises.com',
      phone: '(555) 987-6543',
      email: 'maria@rodriguezenterprises.com',
      address: {
        street: '456 Business Park Drive',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'USA'
      },
      notes: 'Commercial account, purchases multiple units annually for employee housing.',
      tags: ['Commercial', 'High Volume', 'Annual Contract'],
      customFields: {
        preferredContactMethod: 'phone',
        creditRating: 'Good',
        lifetimeValue: 450000,
        contractRenewalDate: '2024-12-31'
      },
      createdAt: new Date('2023-03-01T11:15:00Z'),
      updatedAt: new Date('2024-01-18T16:45:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'manager@company.com'
    },
    {
      id: 'acc-003',
      name: 'Johnson Family',
      type: AccountType.PROSPECT,
      industry: 'Personal',
      website: null,
      phone: '(555) 456-7890',
      email: 'david.johnson@email.com',
      address: {
        street: '789 Oak Avenue',
        city: 'Denver',
        state: 'CO',
        zipCode: '80201',
        country: 'USA'
      },
      notes: 'Interested in manufactured homes, currently renting. Looking to purchase within 6 months.',
      tags: ['First Time Buyer', 'Manufactured Home', 'Hot Lead'],
      customFields: {
        preferredContactMethod: 'text',
        creditRating: 'Fair',
        estimatedBudget: 85000,
        timeframe: '6 months'
      },
      createdAt: new Date('2024-01-08T13:20:00Z'),
      updatedAt: new Date('2024-01-22T10:30:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'acc-004',
      name: 'Sunset RV Parts & Service',
      type: AccountType.VENDOR,
      industry: 'RV Parts & Service',
      website: 'https://sunsetrvparts.com',
      phone: '(555) 234-5678',
      email: 'orders@sunsetrvparts.com',
      address: {
        street: '321 Industrial Blvd',
        city: 'Tampa',
        state: 'FL',
        zipCode: '33601',
        country: 'USA'
      },
      notes: 'Primary parts supplier for RV repairs. Net 30 payment terms.',
      tags: ['Vendor', 'Parts Supplier', 'Preferred'],
      customFields: {
        preferredContactMethod: 'email',
        paymentTerms: 'Net 30',
        discountRate: 15,
        accountManager: 'Jennifer Wilson'
      },
      createdAt: new Date('2023-08-22T09:15:00Z'),
      updatedAt: new Date('2024-01-15T11:30:00Z'),
      createdBy: 'purchasing@company.com',
      updatedBy: 'purchasing@company.com'
    },
    {
      id: 'acc-005',
      name: 'Mountain View Financing',
      type: AccountType.PARTNER,
      industry: 'Financial Services',
      website: 'https://mountainviewfinancing.com',
      phone: '(555) 345-6789',
      email: 'partnerships@mvfinancing.com',
      address: {
        street: '555 Financial Plaza',
        city: 'Charlotte',
        state: 'NC',
        zipCode: '28201',
        country: 'USA'
      },
      notes: 'Financing partner for customer loans. Competitive rates and fast approval.',
      tags: ['Partner', 'Financing', 'Preferred Lender'],
      customFields: {
        preferredContactMethod: 'phone',
        partnershipLevel: 'Gold',
        commissionRate: 2.5,
        approvalTimeframe: '24 hours'
      },
      createdAt: new Date('2023-05-10T14:45:00Z'),
      updatedAt: new Date('2024-01-12T09:20:00Z'),
      createdBy: 'manager@company.com',
      updatedBy: 'manager@company.com'
    }
  ] as Account[],

  accountTypes: [
    { value: AccountType.CUSTOMER, label: 'Customer', color: 'bg-green-100 text-green-800' },
    { value: AccountType.PROSPECT, label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
    { value: AccountType.VENDOR, label: 'Vendor', color: 'bg-purple-100 text-purple-800' },
    { value: AccountType.PARTNER, label: 'Partner', color: 'bg-orange-100 text-orange-800' },
    { value: AccountType.COMPETITOR, label: 'Competitor', color: 'bg-red-100 text-red-800' }
  ],

  industryOptions: [
    'Personal',
    'Construction',
    'Real Estate',
    'RV Parts & Service',
    'Financial Services',
    'Insurance',
    'Transportation',
    'Manufacturing',
    'Retail',
    'Healthcare',
    'Technology',
    'Other'
  ],

  defaultAccount: {
    name: '',
    type: AccountType.PROSPECT,
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    notes: '',
    tags: [],
    customFields: {}
  },

  // Helper functions for statistics
  getAccountStats: function() {
    const accounts = this.sampleAccounts
    const totalAccounts = accounts.length
    const customerAccounts = accounts.filter(acc => acc.type === AccountType.CUSTOMER).length
    const prospectAccounts = accounts.filter(acc => acc.type === AccountType.PROSPECT).length
    const vendorAccounts = accounts.filter(acc => acc.type === AccountType.VENDOR).length
    const partnerAccounts = accounts.filter(acc => acc.type === AccountType.PARTNER).length

    // Calculate new accounts this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = accounts.filter(acc => new Date(acc.createdAt) >= thisMonth).length

    return {
      totalAccounts,
      customerAccounts,
      prospectAccounts,
      vendorAccounts,
      partnerAccounts,
      newThisMonth
    }
  },

  // Filter functions
  filterByType: function(type: AccountType) {
    return this.sampleAccounts.filter(account => account.type === type)
  },

  filterByTag: function(tag: string) {
    return this.sampleAccounts.filter(account => account.tags.includes(tag))
  },

  searchAccounts: function(searchTerm: string) {
    const term = searchTerm.toLowerCase()
    return this.sampleAccounts.filter(account => 
      account.name.toLowerCase().includes(term) ||
      account.email?.toLowerCase().includes(term) ||
      account.phone?.includes(term) ||
      account.industry?.toLowerCase().includes(term) ||
      account.tags.some(tag => tag.toLowerCase().includes(term))
    )
  }
}

export default mockAccounts