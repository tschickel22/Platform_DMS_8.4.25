import { Account } from '@/types'

export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    name: 'RV World Inc.',
    type: 'Customer',
    industry: 'Recreational Vehicles',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA'
    },
    phone: '(555) 111-2222',
    email: 'info@rvworld.com',
    website: 'www.rvworld.com',
    notes: 'Long-standing customer, purchases multiple units annually.',
    createdAt: new Date('2022-01-01T10:00:00Z'),
    updatedAt: new Date('2024-07-20T14:30:00Z')
  },
  {
    id: 'acc-002',
    name: 'Mobile Home Solutions',
    type: 'Partner',
    industry: 'Manufactured Housing',
    address: {
      street: '456 Oak Ave',
      city: 'Fairview',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    phone: '(555) 333-4444',
    email: 'contact@mhsolutions.com',
    website: 'www.mhsolutions.com',
    notes: 'Referral partner for manufactured home sales.',
    createdAt: new Date('2023-03-10T09:00:00Z'),
    updatedAt: new Date('2024-07-18T11:00:00Z')
  },
  {
    id: 'acc-003',
    name: 'Adventure Gear Co.',
    type: 'Vendor',
    industry: 'Outdoor Equipment',
    address: {
      street: '789 Pine Ln',
      city: 'Boulder',
      state: 'CO',
      zipCode: '80302',
      country: 'USA'
    },
    phone: '(555) 555-6666',
    email: 'sales@adventuregear.com',
    website: 'www.adventuregear.com',
    notes: 'Supplies accessories for RVs.',
    createdAt: new Date('2023-06-01T13:00:00Z'),
    updatedAt: new Date('2024-07-15T10:00:00Z')
  },
  {
    id: 'acc-004',
    name: 'Smith Family Trust',
    type: 'Customer',
    industry: 'Personal',
    address: {
      street: '321 Elm Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    website: '',
    notes: 'Individual customer looking for retirement RV.',
    createdAt: new Date('2024-01-10T09:30:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  }
]

export default mockAccounts