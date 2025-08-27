import { Contact } from '@/types'
import { mockAccounts } from './accountsMock'

export const mockContacts: Contact[] = [
  {
    id: 'con-001',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@rvworld.com',
    phone: '(555) 111-2223',
    accountId: mockAccounts[0].id,
    accountName: mockAccounts[0].name,
    title: 'Sales Manager',
    source: 'Direct',
    notes: 'Primary contact for new RV sales.',
    tags: ['Key Contact', 'Sales'],
    createdAt: new Date('2023-02-15T11:00:00Z'),
    updatedAt: new Date('2024-07-25T09:00:00Z')
  },
  {
    id: 'con-002',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.j@mhsolutions.com',
    phone: '(555) 333-4445',
    accountId: mockAccounts[1].id,
    accountName: mockAccounts[1].name,
    title: 'Partnership Coordinator',
    source: 'Referral',
    notes: 'Handles all new manufactured home referrals.',
    tags: ['Partner', 'Referral'],
    createdAt: new Date('2023-04-20T14:00:00Z'),
    updatedAt: new Date('2024-07-22T16:00:00Z')
  },
  {
    id: 'con-003',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.b@example.com',
    phone: '(555) 777-8888',
    accountId: undefined, // Standalone contact
    accountName: undefined,
    title: 'Prospective Buyer',
    source: 'Website',
    notes: 'Interested in a small travel trailer. No associated account yet.',
    tags: ['Prospect', 'New Inquiry'],
    createdAt: new Date('2024-07-01T09:30:00Z'),
    updatedAt: new Date('2024-07-01T09:30:00Z')
  },
  {
    id: 'con-004',
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'diana.p@adventuregear.com',
    phone: '(555) 555-6667',
    accountId: mockAccounts[2].id,
    accountName: mockAccounts[2].name,
    title: 'Account Manager',
    source: 'Vendor List',
    notes: 'Manages our account with Adventure Gear Co.',
    tags: ['Vendor', 'Primary'],
    createdAt: new Date('2023-07-05T10:00:00Z'),
    updatedAt: new Date('2024-07-10T14:00:00Z')
  },
  {
    id: 'con-005',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    accountId: mockAccounts[3].id,
    accountName: mockAccounts[3].name,
    title: 'Owner',
    source: 'Direct',
    notes: 'Primary contact for Smith Family Trust account.',
    tags: ['Customer', 'Primary'],
    createdAt: new Date('2024-01-10T09:30:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  }
]

export default mockContacts