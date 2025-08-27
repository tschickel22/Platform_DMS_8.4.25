import { Contact, Note } from '@/types'
import { generateId } from '@/lib/utils'

const sampleContacts: Contact[] = [
  {
    id: 'con-001',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@rvworld.com',
    phone: '(555) 111-2223',
    accountId: 'acc-001', // Linked to RV World Inc.
    notes: [
      { 
        id: generateId(), 
        content: 'Primary contact for RV World.', 
        createdAt: '2024-07-01T10:05:00Z', 
        createdBy: 'Admin User' 
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
    notes: [
      { 
        id: generateId(), 
        content: 'Met at trade show, interested in general RV info.', 
        createdAt: '2024-07-05T11:00:00Z', 
        createdBy: 'Admin User' 
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
    notes: [],
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  }
]

export const contactsMock = {
  getContacts: (): Contact[] => {
    try {
      const stored = localStorage.getItem('mockContacts')
      return stored ? JSON.parse(stored) : sampleContacts
    } catch (error) {
      console.error('Error loading contacts from localStorage:', error)
      return sampleContacts
    }
  },

  getContact: (id: string): Contact | undefined => {
    const contacts = contactsMock.getContacts()
    return contacts.find(contact => contact.id === id)
  },

  createContact: (newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Contact => {
    const contacts = contactsMock.getContacts()
    const contact: Contact = {
      id: generateId(),
      ...newContact,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    contacts.push(contact)
    localStorage.setItem('mockContacts', JSON.stringify(contacts))
    return contact
  },

  updateContact: (id: string, updates: Partial<Contact>): Contact | undefined => {
    let contacts = contactsMock.getContacts()
    const index = contacts.findIndex(contact => contact.id === id)
    if (index === -1) return undefined

    const updatedContact = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    contacts[index] = updatedContact
    localStorage.setItem('mockContacts', JSON.stringify(contacts))
    return updatedContact
  },

  deleteContact: (id: string): boolean => {
    let contacts = contactsMock.getContacts()
    const initialLength = contacts.length
    contacts = contacts.filter(contact => contact.id !== id)
    localStorage.setItem('mockContacts', JSON.stringify(contacts))
    return contacts.length < initialLength
  },

  addNoteToContact: (contactId: string, noteContent: string, createdBy: string): Contact | undefined => {
    const contact = contactsMock.getContact(contactId)
    if (!contact) return undefined

    const newNote: Note = {
      id: generateId(),
      content: noteContent,
      createdAt: new Date().toISOString(),
      createdBy: createdBy
    }
    const updatedNotes = [...contact.notes, newNote]
    return contactsMock.updateContact(contactId, { notes: updatedNotes })
  },

  updateNoteInContact: (contactId: string, noteId: string, newContent: string): Contact | undefined => {
    const contact = contactsMock.getContact(contactId)
    if (!contact) return undefined

    const updatedNotes = contact.notes.map(note =>
      note.id === noteId ? { ...note, content: newContent } : note
    )
    return contactsMock.updateContact(contactId, { notes: updatedNotes })
  },

  deleteNoteFromContact: (contactId: string, noteId: string): Contact | undefined => {
    const contact = contactsMock.getContact(contactId)
    if (!contact) return undefined

    const updatedNotes = contact.notes.filter(note => note.id !== noteId)
    return contactsMock.updateContact(contactId, { notes: updatedNotes })
  }
}

export default contactsMock