import { Contact, Note } from '@/types'
import { generateId } from '@/lib/utils'

// Generate tenant-specific storage key
const getStorageKey = (tenantId?: string) => {
  return `mockContacts_${tenantId || 'default'}`
}

const generateSampleContacts = (): Contact[] => [
  {
    id: 'con-001',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@rvworld.com',
    phone: '(555) 111-2223',
    accountId: 'acc-001', // Linked to RV World Inc.
    title: 'Sales Manager',
    department: 'Sales',
    isPrimary: true,
    ownerId: 'user-1',
    preferredContactMethod: 'email',
    tags: ['Primary Contact', 'Decision Maker'],
    preferences: {
      preferredContactMethod: 'email',
      bestTimeToContact: 'Weekdays 9am-5pm',
      timezone: 'America/New_York'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/alice-smith'
    },
    lastContactDate: '2024-01-20T14:30:00Z',
    nextFollowUpDate: '2024-02-01',
    notes: [
      { 
        id: generateId(), 
        content: 'Primary contact for RV World.', 
        createdAt: '2024-07-01T10:05:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-07-01T10:05:00Z'
      }
    ],
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-01T10:05:00Z'
  },
  {
    id: 'con-002',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.j@mhsolutions.com',
    phone: '(555) 333-4445',
    accountId: 'acc-002', // Linked to Mobile Home Solutions
    title: 'Operations Director',
    department: 'Operations',
    isPrimary: false,
    ownerId: 'user-2',
    preferredContactMethod: 'phone',
    tags: ['Sales Contact'],
    preferences: {
      preferredContactMethod: 'phone',
      bestTimeToContact: 'Mornings',
      timezone: 'America/Chicago'
    },
    lastContactDate: '2024-01-18T10:00:00Z',
    notes: [],
    createdAt: '2024-06-20T09:10:00Z',
    updatedAt: '2024-06-20T09:10:00Z'
  },
  {
    id: 'con-003',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.b@example.com',
    phone: '(555) 777-8888',
    accountId: undefined, // No associated account
    title: 'Independent Buyer',
    isPrimary: false,
    ownerId: 'user-1',
    preferredContactMethod: 'sms',
    tags: ['Trade Show Lead', 'Follow-up Needed'],
    preferences: {
      preferredContactMethod: 'sms',
      bestTimeToContact: 'Evenings',
      timezone: 'America/Los_Angeles'
    },
    nextFollowUpDate: '2024-02-05',
    notes: [
      { 
        id: generateId(), 
        content: 'Met at trade show, interested in general RV info.', 
        createdAt: '2024-07-05T11:00:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-07-05T11:00:00Z'
      }
    ],
    createdAt: '2024-07-05T10:30:00Z',
    updatedAt: '2024-07-05T11:00:00Z'
  },
  {
    id: 'con-004',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    accountId: undefined, // No associated account
    isPrimary: false,
    ownerId: 'user-2',
    preferredContactMethod: 'email',
    tags: [],
    preferences: {
      preferredContactMethod: 'email'
    },
    notes: [],
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 'con-005',
    firstName: 'Tom',
    lastName: 'Wilson',
    email: 'tom.wilson@rvworld.com',
    phone: '(555) 111-2224',
    accountId: 'acc-001', // Also linked to RV World Inc.
    title: 'Service Manager',
    department: 'Service',
    isPrimary: false,
    ownerId: 'user-1',
    preferredContactMethod: 'phone',
    tags: ['Service Contact'],
    preferences: {
      preferredContactMethod: 'phone',
      bestTimeToContact: 'Business hours',
      timezone: 'America/New_York'
    },
    notes: [],
    createdAt: '2024-07-01T10:30:00Z',
    updatedAt: '2024-07-01T10:30:00Z'
  },
  {
    id: 'con-006',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 444-5555',
    accountId: 'acc-004', // Linked to Sunset Mobile Home Community
    title: 'Community Manager',
    department: 'Management',
    isPrimary: true,
    ownerId: 'user-2',
    preferredContactMethod: 'email',
    tags: ['Primary Contact', 'Community Management'],
    preferences: {
      preferredContactMethod: 'email',
      bestTimeToContact: 'Weekdays 8am-6pm',
      timezone: 'America/Los_Angeles'
    },
    notes: [
      { 
        id: generateId(), 
        content: 'Manages day-to-day operations for the community.', 
        createdAt: '2024-06-01T16:00:00Z', 
        createdBy: 'Admin User',
        updatedAt: '2024-06-01T16:00:00Z'
      }
    ],
    createdAt: '2024-06-01T16:00:00Z',
    updatedAt: '2024-06-01T16:00:00Z'
  }
]

export const contactsMock = {
  getContacts: (tenantId?: string): Contact[] => {
    try {
      const storageKey = getStorageKey(tenantId)
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Seed with sample data if empty
      const sampleData = generateSampleContacts()
      localStorage.setItem(storageKey, JSON.stringify(sampleData))
      return sampleData
    } catch (error) {
      console.error('Error loading contacts from localStorage:', error)
      return generateSampleContacts()
    }
  },

  getContact: (id: string, tenantId?: string): Contact | null => {
    try {
      const contacts = contactsMock.getContacts(tenantId)
      return contacts.find(contact => contact.id === id) || null
    } catch (error) {
      console.error('Error getting contact:', error)
      return null
    }
  },

  createContact: (newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'notes'>, tenantId?: string): Contact => {
    const contacts = contactsMock.getContacts(tenantId)
    const contact: Contact = {
      id: generateId(),
      ...newContact,
      tags: newContact.tags || [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    contacts.push(contact)
    localStorage.setItem(getStorageKey(tenantId), JSON.stringify(contacts))
    return contact
  },

  updateContact: (id: string, updates: Partial<Contact>, tenantId?: string): Contact | null => {
    try {
      let contacts = contactsMock.getContacts(tenantId)
    const index = contacts.findIndex(contact => contact.id === id)
      if (index === -1) return null

    const updatedContact = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    contacts[index] = updatedContact
      localStorage.setItem(getStorageKey(tenantId), JSON.stringify(contacts))
    return updatedContact
    } catch (error) {
      console.error('Error updating contact:', error)
      return null
    }
  },

  deleteContact: (id: string, tenantId?: string): boolean => {
    try {
      let contacts = contactsMock.getContacts(tenantId)
    const initialLength = contacts.length
    contacts = contacts.filter(contact => contact.id !== id)
      localStorage.setItem(getStorageKey(tenantId), JSON.stringify(contacts))
    return contacts.length < initialLength
    } catch (error) {
      console.error('Error deleting contact:', error)
      return false
    }
  },

  addNoteToContact: (contactId: string, noteContent: string, createdBy: string, tenantId?: string): Contact | null => {
    const contact = contactsMock.getContact(contactId, tenantId)
    if (!contact) return null

    const newNote: Note = {
      id: generateId(),
      content: noteContent,
      createdAt: new Date().toISOString(),
      createdBy: createdBy,
      updatedAt: new Date().toISOString(),
      updatedBy: createdBy
    }
    const updatedNotes = [...contact.notes, newNote]
    return contactsMock.updateContact(contactId, { notes: updatedNotes }, tenantId)
  },

  updateNoteInContact: (contactId: string, noteId: string, newContent: string, updatedBy: string, tenantId?: string): Contact | null => {
    const contact = contactsMock.getContact(contactId, tenantId)
    if (!contact) return null

    const updatedNotes = contact.notes.map(note =>
      note.id === noteId ? { 
        ...note, 
        content: newContent,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedBy
      } : note
    )
    return contactsMock.updateContact(contactId, { notes: updatedNotes }, tenantId)
  },

  deleteNoteFromContact: (contactId: string, noteId: string, tenantId?: string): Contact | null => {
    const contact = contactsMock.getContact(contactId, tenantId)
    if (!contact) return null

    const updatedNotes = contact.notes.filter(note => note.id !== noteId)
    return contactsMock.updateContact(contactId, { notes: updatedNotes }, tenantId)
  }
}

export default contactsMock