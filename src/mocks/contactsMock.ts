import { Contact } from '@/types'

export const mockContacts = {
  sampleContacts: [
    {
      id: 'cont-001',
      accountId: 'acc-001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      title: 'Owner',
      department: 'Management',
      notes: 'Primary decision maker for RV purchases. Prefers morning calls.',
      tags: ['Decision Maker', 'VIP', 'Morning Calls'],
      customFields: {
        preferredContactTime: 'Morning',
        communicationPreference: 'Email',
        birthday: '1975-03-15',
        spouse: 'Jane Smith'
      },
      createdAt: new Date('2023-06-15T10:30:00Z'),
      updatedAt: new Date('2024-01-20T14:22:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'cont-002',
      accountId: 'acc-001',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 123-4568',
      title: 'Co-Owner',
      department: 'Management',
      notes: 'Handles financial decisions and paperwork. Available weekdays.',
      tags: ['Financial Contact', 'Weekdays Only'],
      customFields: {
        preferredContactTime: 'Afternoon',
        communicationPreference: 'Phone',
        birthday: '1978-07-22',
        role: 'Financial Decision Maker'
      },
      createdAt: new Date('2023-06-15T10:35:00Z'),
      updatedAt: new Date('2024-01-18T11:15:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'cont-003',
      accountId: 'acc-002',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria@rodriguezenterprises.com',
      phone: '(555) 987-6543',
      title: 'CEO',
      department: 'Executive',
      notes: 'Busy executive, prefers text messages for quick communication.',
      tags: ['Executive', 'Text Preferred', 'Quick Response'],
      customFields: {
        preferredContactTime: 'Any',
        communicationPreference: 'Text',
        assistantEmail: 'assistant@rodriguezenterprises.com',
        decisionAuthority: 'Full'
      },
      createdAt: new Date('2023-03-01T11:15:00Z'),
      updatedAt: new Date('2024-01-22T09:30:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'cont-004',
      accountId: 'acc-002',
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      email: 'carlos@rodriguezenterprises.com',
      phone: '(555) 987-6544',
      title: 'Operations Manager',
      department: 'Operations',
      notes: 'Handles day-to-day operations and logistics coordination.',
      tags: ['Operations', 'Logistics', 'Detail Oriented'],
      customFields: {
        preferredContactTime: 'Business Hours',
        communicationPreference: 'Email',
        specialties: ['Logistics', 'Project Management'],
        reportsTo: 'Maria Rodriguez'
      },
      createdAt: new Date('2023-03-05T14:20:00Z'),
      updatedAt: new Date('2024-01-19T16:45:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'cont-005',
      accountId: 'acc-003',
      firstName: 'David',
      lastName: 'Johnson',
      email: 'david.johnson@email.com',
      phone: '(555) 456-7890',
      title: 'Homeowner',
      department: null,
      notes: 'First-time manufactured home buyer. Needs education on financing options.',
      tags: ['First Time Buyer', 'Education Needed', 'Financing'],
      customFields: {
        preferredContactTime: 'Evening',
        communicationPreference: 'Phone',
        currentHousing: 'Rental',
        moveInTimeline: '6 months'
      },
      createdAt: new Date('2024-01-08T13:20:00Z'),
      updatedAt: new Date('2024-01-22T10:30:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    },
    {
      id: 'cont-006',
      accountId: 'acc-004',
      firstName: 'Jennifer',
      lastName: 'Wilson',
      email: 'jennifer@sunsetrvparts.com',
      phone: '(555) 234-5678',
      title: 'Account Manager',
      department: 'Sales',
      notes: 'Primary contact for parts orders and warranty claims.',
      tags: ['Account Manager', 'Parts Expert', 'Warranty'],
      customFields: {
        preferredContactTime: 'Business Hours',
        communicationPreference: 'Email',
        specialties: ['Parts Ordering', 'Warranty Claims'],
        territory: 'Southeast'
      },
      createdAt: new Date('2023-08-22T09:15:00Z'),
      updatedAt: new Date('2024-01-15T11:30:00Z'),
      createdBy: 'purchasing@company.com',
      updatedBy: 'purchasing@company.com'
    },
    {
      id: 'cont-007',
      accountId: 'acc-005',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@mvfinancing.com',
      phone: '(555) 345-6789',
      title: 'Senior Loan Officer',
      department: 'Lending',
      notes: 'Handles high-value loans and complex financing scenarios.',
      tags: ['Loan Officer', 'High Value', 'Complex Deals'],
      customFields: {
        preferredContactTime: 'Business Hours',
        communicationPreference: 'Phone',
        specialties: ['Commercial Loans', 'High Value Financing'],
        approvalLimit: 500000
      },
      createdAt: new Date('2023-05-10T14:45:00Z'),
      updatedAt: new Date('2024-01-12T09:20:00Z'),
      createdBy: 'manager@company.com',
      updatedBy: 'manager@company.com'
    },
    {
      id: 'cont-008',
      accountId: null, // Unassigned contact
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@email.com',
      phone: '(555) 567-8901',
      title: 'Buyer',
      department: null,
      notes: 'Interested in travel trailers. No account created yet.',
      tags: ['Unassigned', 'Travel Trailer', 'New Lead'],
      customFields: {
        preferredContactTime: 'Weekend',
        communicationPreference: 'Email',
        leadSource: 'Website',
        interest: 'Travel Trailer'
      },
      createdAt: new Date('2024-01-25T16:30:00Z'),
      updatedAt: new Date('2024-01-25T16:30:00Z'),
      createdBy: 'sales@company.com',
      updatedBy: 'sales@company.com'
    }
  ] as Contact[],

  defaultContact: {
    accountId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    notes: '',
    tags: [],
    customFields: {}
  },

  departmentOptions: [
    'Executive',
    'Management',
    'Sales',
    'Operations',
    'Finance',
    'Purchasing',
    'Lending',
    'Customer Service',
    'Technical',
    'Other'
  ],

  titleOptions: [
    'Owner',
    'Co-Owner',
    'CEO',
    'President',
    'Vice President',
    'Manager',
    'Director',
    'Supervisor',
    'Coordinator',
    'Specialist',
    'Representative',
    'Agent',
    'Officer',
    'Analyst',
    'Consultant',
    'Other'
  ],

  // Helper functions for statistics
  getContactStats: function() {
    const contacts = this.sampleContacts
    const totalContacts = contacts.length
    const assignedContacts = contacts.filter(contact => contact.accountId).length
    const unassignedContacts = contacts.filter(contact => !contact.accountId).length

    // Calculate new contacts this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = contacts.filter(contact => new Date(contact.createdAt) >= thisMonth).length

    // Calculate contacts by department
    const contactsByDepartment = contacts.reduce((acc, contact) => {
      const dept = contact.department || 'Unspecified'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalContacts,
      assignedContacts,
      unassignedContacts,
      newThisMonth,
      contactsByDepartment
    }
  },

  // Filter functions
  filterByAccount: function(accountId: string) {
    return this.sampleContacts.filter(contact => contact.accountId === accountId)
  },

  filterByTag: function(tag: string) {
    return this.sampleContacts.filter(contact => contact.tags.includes(tag))
  },

  filterByDepartment: function(department: string) {
    return this.sampleContacts.filter(contact => contact.department === department)
  },

  searchContacts: function(searchTerm: string) {
    const term = searchTerm.toLowerCase()
    return this.sampleContacts.filter(contact => 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term) ||
      contact.phone?.includes(term) ||
      contact.title?.toLowerCase().includes(term) ||
      contact.department?.toLowerCase().includes(term) ||
      contact.tags.some(tag => tag.toLowerCase().includes(term))
    )
  },

  getUnassignedContacts: function() {
    return this.sampleContacts.filter(contact => !contact.accountId)
  }
}

export default mockContacts