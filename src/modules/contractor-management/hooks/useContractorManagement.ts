import { useState, useEffect, useMemo } from 'react'
import { 
  Contractor, 
  AvailabilitySlot, 
  ContractorJob, 
  ContractorTrade, 
  ContractorJobType, 
  ContractorJobStatus, 
  AvailabilityStatus, 
  Priority 
} from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

// Mock data for contractors
const mockContractors: Contractor[] = [
  {
    id: 'contractor-1',
    name: 'Mike Johnson',
    trade: ContractorTrade.ELECTRICAL,
    contactInfo: {
      email: 'mike.johnson@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, City, State 12345'
    },
    ratings: {
      averageRating: 4.8,
      reviewCount: 24
    },
    assignedJobIds: ['job-1', 'job-3'],
    isActive: true,
    notes: 'Experienced electrical contractor, specializes in RV electrical systems',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'contractor-2',
    name: 'Sarah Williams',
    trade: ContractorTrade.PLUMBING,
    contactInfo: {
      email: 'sarah.williams@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, City, State 12345'
    },
    ratings: {
      averageRating: 4.9,
      reviewCount: 31
    },
    assignedJobIds: ['job-2'],
    isActive: true,
    notes: 'Expert in RV plumbing systems and mobile home installations',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'contractor-3',
    name: 'David Brown',
    trade: ContractorTrade.SKIRTING,
    contactInfo: {
      email: 'david.brown@email.com',
      phone: '(555) 345-6789',
      address: '789 Pine St, City, State 12345'
    },
    ratings: {
      averageRating: 4.6,
      reviewCount: 18
    },
    assignedJobIds: [],
    isActive: true,
    notes: 'Specializes in mobile home skirting and underpinning',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'contractor-4',
    name: 'Lisa Garcia',
    trade: ContractorTrade.HVAC,
    contactInfo: {
      email: 'lisa.garcia@email.com',
      phone: '(555) 456-7890',
      address: '321 Elm St, City, State 12345'
    },
    ratings: {
      averageRating: 4.7,
      reviewCount: 22
    },
    assignedJobIds: ['job-4'],
    isActive: true,
    notes: 'HVAC specialist for RVs and mobile homes',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'contractor-5',
    name: 'Tom Anderson',
    trade: ContractorTrade.GENERAL,
    contactInfo: {
      email: 'tom.anderson@email.com',
      phone: '(555) 567-8901',
      address: '654 Maple Dr, City, State 12345'
    },
    ratings: {
      averageRating: 4.5,
      reviewCount: 15
    },
    assignedJobIds: [],
    isActive: false,
    notes: 'General contractor, currently on leave',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
]

// Mock data for availability slots
const mockAvailabilitySlots: AvailabilitySlot[] = [
  // Mike Johnson (contractor-1) availability
  {
    id: 'slot-1',
    contractorId: 'contractor-1',
    date: '2024-01-25',
    startTime: '08:00',
    endTime: '12:00',
    status: AvailabilityStatus.BOOKED,
    jobId: 'job-1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'slot-2',
    contractorId: 'contractor-1',
    date: '2024-01-25',
    startTime: '13:00',
    endTime: '17:00',
    status: AvailabilityStatus.AVAILABLE,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'slot-3',
    contractorId: 'contractor-1',
    date: '2024-01-26',
    startTime: '08:00',
    endTime: '16:00',
    status: AvailabilityStatus.BOOKED,
    jobId: 'job-3',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  // Sarah Williams (contractor-2) availability
  {
    id: 'slot-4',
    contractorId: 'contractor-2',
    date: '2024-01-25',
    startTime: '09:00',
    endTime: '15:00',
    status: AvailabilityStatus.BOOKED,
    jobId: 'job-2',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'slot-5',
    contractorId: 'contractor-2',
    date: '2024-01-26',
    startTime: '08:00',
    endTime: '17:00',
    status: AvailabilityStatus.AVAILABLE,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  // David Brown (contractor-3) availability
  {
    id: 'slot-6',
    contractorId: 'contractor-3',
    date: '2024-01-25',
    startTime: '08:00',
    endTime: '17:00',
    status: AvailabilityStatus.AVAILABLE,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'slot-7',
    contractorId: 'contractor-3',
    date: '2024-01-26',
    startTime: '08:00',
    endTime: '17:00',
    status: AvailabilityStatus.AVAILABLE,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  // Lisa Garcia (contractor-4) availability
  {
    id: 'slot-8',
    contractorId: 'contractor-4',
    date: '2024-01-25',
    startTime: '10:00',
    endTime: '16:00',
    status: AvailabilityStatus.BOOKED,
    jobId: 'job-4',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

// Mock data for contractor jobs
const mockContractorJobs: ContractorJob[] = [
  {
    id: 'job-1',
    unitAddress: '123 RV Park Lane, Lot 15',
    jobType: ContractorJobType.INSTALLATION,
    trade: ContractorTrade.ELECTRICAL,
    scheduledDate: new Date('2024-01-25T08:00:00'),
    estimatedDuration: 4,
    status: ContractorJobStatus.ASSIGNED,
    assignedContractorId: 'contractor-1',
    assignedContractorName: 'Mike Johnson',
    description: 'Install new electrical panel and upgrade wiring for Class A motorhome',
    priority: Priority.HIGH,
    customerName: 'John Smith',
    customerPhone: '(555) 111-2222',
    customerEmail: 'john.smith@email.com',
    specialInstructions: 'Customer will be present during installation. Access through rear panel.',
    photos: [],
    notes: 'Customer requested upgrade to 50-amp service',
    customFields: {},
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'job-2',
    unitAddress: '456 Mobile Home Park, Unit 22',
    jobType: ContractorJobType.REPAIR,
    trade: ContractorTrade.PLUMBING,
    scheduledDate: new Date('2024-01-25T09:00:00'),
    estimatedDuration: 6,
    status: ContractorJobStatus.ASSIGNED,
    assignedContractorId: 'contractor-2',
    assignedContractorName: 'Sarah Williams',
    description: 'Fix water leak under kitchen sink and replace damaged pipes',
    priority: Priority.URGENT,
    customerName: 'Mary Johnson',
    customerPhone: '(555) 222-3333',
    customerEmail: 'mary.johnson@email.com',
    specialInstructions: 'Water has been shut off. Customer has spare key under mat.',
    photos: [],
    notes: 'Leak has been ongoing for 3 days, causing floor damage',
    customFields: {},
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'job-3',
    unitAddress: '789 RV Resort, Site 8',
    jobType: ContractorJobType.MAINTENANCE,
    trade: ContractorTrade.ELECTRICAL,
    scheduledDate: new Date('2024-01-26T08:00:00'),
    estimatedDuration: 8,
    status: ContractorJobStatus.ASSIGNED,
    assignedContractorId: 'contractor-1',
    assignedContractorName: 'Mike Johnson',
    description: 'Annual electrical system inspection and maintenance',
    priority: Priority.MEDIUM,
    customerName: 'Bob Wilson',
    customerPhone: '(555) 333-4444',
    customerEmail: 'bob.wilson@email.com',
    specialInstructions: 'Full system check required for insurance compliance',
    photos: [],
    notes: 'Customer has been with us for 5 years, very reliable',
    customFields: {},
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'job-4',
    unitAddress: '321 Trailer Park, Lot 45',
    jobType: ContractorJobType.INSTALLATION,
    trade: ContractorTrade.HVAC,
    scheduledDate: new Date('2024-01-25T10:00:00'),
    estimatedDuration: 6,
    status: ContractorJobStatus.ASSIGNED,
    assignedContractorId: 'contractor-4',
    assignedContractorName: 'Lisa Garcia',
    description: 'Install new heat pump system for mobile home',
    priority: Priority.HIGH,
    customerName: 'Susan Davis',
    customerPhone: '(555) 444-5555',
    customerEmail: 'susan.davis@email.com',
    specialInstructions: 'Old unit needs to be removed first. Customer prefers morning installation.',
    photos: [],
    notes: 'Customer upgrading from old window units',
    customFields: {},
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'job-5',
    unitAddress: '654 RV Park, Site 12',
    jobType: ContractorJobType.SETUP,
    trade: ContractorTrade.SKIRTING,
    scheduledDate: new Date('2024-01-27T08:00:00'),
    estimatedDuration: 4,
    status: ContractorJobStatus.PENDING,
    description: 'Install skirting around new mobile home setup',
    priority: Priority.MEDIUM,
    customerName: 'Mike Thompson',
    customerPhone: '(555) 555-6666',
    customerEmail: 'mike.thompson@email.com',
    specialInstructions: 'New unit just delivered, needs full skirting installation',
    photos: [],
    notes: 'Customer moving in next week',
    customFields: {},
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
]

export function useContractorManagement() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [contractorJobs, setContractorJobs] = useState<ContractorJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedContractors = loadFromLocalStorage('contractor-management-contractors', mockContractors)
      const savedAvailability = loadFromLocalStorage('contractor-management-availability', mockAvailabilitySlots)
      const savedJobs = loadFromLocalStorage('contractor-management-jobs', mockContractorJobs)

      // Convert date strings back to Date objects for contractors
      const contractorsWithDates = savedContractors.map(contractor => ({
        ...contractor,
        createdAt: new Date(contractor.createdAt),
        updatedAt: new Date(contractor.updatedAt)
      }))

      // Convert date strings back to Date objects for availability slots
      const availabilityWithDates = savedAvailability.map(slot => ({
        ...slot,
        createdAt: new Date(slot.createdAt),
        updatedAt: new Date(slot.updatedAt)
      }))

      // Convert date strings back to Date objects for contractor jobs
      const jobsWithDates = savedJobs.map(job => ({
        ...job,
        scheduledDate: new Date(job.scheduledDate),
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
        ...(job.completedAt && { completedAt: new Date(job.completedAt) })
      }))

      setContractors(contractorsWithDates)
      setAvailabilitySlots(availabilityWithDates)
      setContractorJobs(jobsWithDates)
    } catch (err) {
      console.error('Error loading contractor data:', err)
      setError('Failed to load contractor data')
      // Fallback to mock data
      setContractors(mockContractors)
      setAvailabilitySlots(mockAvailabilitySlots)
      setContractorJobs(mockContractorJobs)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage('contractor-management-contractors', contractors)
    }
  }, [contractors, loading])

  useEffect(() => {
    if (!loading) {
      saveToLocalStorage('contractor-management-availability', availabilitySlots)
    }
  }, [availabilitySlots, loading])

  useEffect(() => {
    if (!loading) {
      saveToLocalStorage('contractor-management-jobs', contractorJobs)
    }
  }, [contractorJobs, loading])

  // Contractor management functions
  const getContractors = () => contractors

  const getContractorById = (id: string) => contractors.find(c => c.id === id)

  const addContractor = (contractor: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContractor: Contractor = {
      ...contractor,
      id: `contractor-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setContractors(prev => [...prev, newContractor])
    return newContractor
  }

  const updateContractor = (id: string, updates: Partial<Contractor>) => {
    setContractors(prev => prev.map(contractor => 
      contractor.id === id 
        ? { ...contractor, ...updates, updatedAt: new Date() }
        : contractor
    ))
  }

  const deleteContractor = (id: string) => {
    setContractors(prev => prev.filter(contractor => contractor.id !== id))
    // Also remove their availability slots and unassign their jobs
    setAvailabilitySlots(prev => prev.filter(slot => slot.contractorId !== id))
    setContractorJobs(prev => prev.map(job => 
      job.assignedContractorId === id 
        ? { ...job, assignedContractorId: undefined, assignedContractorName: undefined, status: ContractorJobStatus.PENDING }
        : job
    ))
  }

  // Availability management functions
  const getContractorAvailability = (contractorId: string, date?: string) => {
    return availabilitySlots.filter(slot => 
      slot.contractorId === contractorId && 
      (date ? slot.date === date : true)
    )
  }

  const addAvailabilitySlot = (slot: Omit<AvailabilitySlot, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setAvailabilitySlots(prev => [...prev, newSlot])
    return newSlot
  }

  const updateAvailabilitySlot = (id: string, updates: Partial<AvailabilitySlot>) => {
    setAvailabilitySlots(prev => prev.map(slot => 
      slot.id === id 
        ? { ...slot, ...updates, updatedAt: new Date() }
        : slot
    ))
  }

  const deleteAvailabilitySlot = (id: string) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== id))
  }

  // Job management functions
  const getContractorJobs = () => contractorJobs

  const getJobById = (id: string) => contractorJobs.find(job => job.id === id)

  const getJobsByContractor = (contractorId: string) => {
    return contractorJobs.filter(job => job.assignedContractorId === contractorId)
  }

  const addContractorJob = (job: Omit<ContractorJob, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: ContractorJob = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setContractorJobs(prev => [...prev, newJob])
    return newJob
  }

  const updateContractorJob = (id: string, updates: Partial<ContractorJob>) => {
    setContractorJobs(prev => prev.map(job => 
      job.id === id 
        ? { ...job, ...updates, updatedAt: new Date() }
        : job
    ))
  }

  const assignJobToContractor = (jobId: string, contractorId: string, slotId?: string) => {
    const contractor = getContractorById(contractorId)
    if (!contractor) {
      throw new Error('Contractor not found')
    }

    // Update job with contractor assignment
    updateContractorJob(jobId, {
      assignedContractorId: contractorId,
      assignedContractorName: contractor.name,
      status: ContractorJobStatus.ASSIGNED
    })

    // Update contractor's assigned jobs
    updateContractor(contractorId, {
      assignedJobIds: [...contractor.assignedJobIds, jobId]
    })

    // If a specific slot is provided, mark it as booked
    if (slotId) {
      updateAvailabilitySlot(slotId, {
        status: AvailabilityStatus.BOOKED,
        jobId
      })
    }

    // Simulate notification
    console.log(`📱 SMS/Email sent to ${contractor.name} (${contractor.contactInfo.phone}):`)
    console.log(`New job assigned! Job ID: ${jobId}`)
    console.log(`Portal link: ${window.location.origin}/contractors/portal?contractorId=${contractorId}&jobId=${jobId}`)
  }

  const unassignJobFromContractor = (jobId: string) => {
    const job = getJobById(jobId)
    if (!job || !job.assignedContractorId) return

    const contractor = getContractorById(job.assignedContractorId)
    if (contractor) {
      // Update contractor's assigned jobs
      updateContractor(contractor.id, {
        assignedJobIds: contractor.assignedJobIds.filter(id => id !== jobId)
      })
    }

    // Update job status
    updateContractorJob(jobId, {
      assignedContractorId: undefined,
      assignedContractorName: undefined,
      status: ContractorJobStatus.PENDING
    })

    // Free up any booked availability slot
    const bookedSlot = availabilitySlots.find(slot => slot.jobId === jobId)
    if (bookedSlot) {
      updateAvailabilitySlot(bookedSlot.id, {
        status: AvailabilityStatus.AVAILABLE,
        jobId: undefined
      })
    }
  }

  const deleteContractorJob = (id: string) => {
    const job = getJobById(id)
    if (job && job.assignedContractorId) {
      unassignJobFromContractor(id)
    }
    setContractorJobs(prev => prev.filter(job => job.id !== id))
  }

  // Advanced search and filtering
  const searchContractors = (query: string, filters?: {
    trade?: ContractorTrade
    isActive?: boolean
    minRating?: number
    hasAvailability?: boolean
  }) => {
    let results = contractors

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      results = results.filter(contractor =>
        contractor.name.toLowerCase().includes(searchTerm) ||
        contractor.contactInfo.email.toLowerCase().includes(searchTerm) ||
        contractor.contactInfo.phone.includes(searchTerm) ||
        (contractor.notes && contractor.notes.toLowerCase().includes(searchTerm))
      )
    }

    // Apply filters
    if (filters) {
      if (filters.trade) {
        results = results.filter(c => c.trade === filters.trade)
      }
      if (filters.isActive !== undefined) {
        results = results.filter(c => c.isActive === filters.isActive)
      }
      if (filters.minRating) {
        results = results.filter(c => c.ratings.averageRating >= filters.minRating)
      }
      if (filters.hasAvailability) {
        const today = new Date().toISOString().split('T')[0]
        results = results.filter(contractor => {
          const todaySlots = getContractorAvailability(contractor.id, today)
          return todaySlots.some(slot => slot.status === AvailabilityStatus.AVAILABLE)
        })
      }
    }

    return results
  }

  // Export contractor data
  const exportContractorData = (format: 'csv' | 'json' = 'csv') => {
    const data = contractors.map(contractor => ({
      id: contractor.id,
      name: contractor.name,
      trade: contractor.trade,
      email: contractor.contactInfo.email,
      phone: contractor.contactInfo.phone,
      address: contractor.contactInfo.address || '',
      rating: contractor.ratings.averageRating,
      reviewCount: contractor.ratings.reviewCount,
      activeJobs: contractor.assignedJobIds.length,
      isActive: contractor.isActive,
      notes: contractor.notes || '',
      createdAt: contractor.createdAt.toISOString(),
      updatedAt: contractor.updatedAt.toISOString()
    }))

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contractors-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // CSV format
      const headers = Object.keys(data[0] || {})
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contractors-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // Bulk operations
  const bulkUpdateContractors = (contractorIds: string[], updates: Partial<Contractor>) => {
    setContractors(prev => prev.map(contractor =>
      contractorIds.includes(contractor.id)
        ? { ...contractor, ...updates, updatedAt: new Date() }
        : contractor
    ))
  }

  const bulkDeleteContractors = (contractorIds: string[]) => {
    contractorIds.forEach(id => deleteContractor(id))
  }

  // Computed values
  const activeContractors = useMemo(() => 
    contractors.filter(contractor => contractor.isActive), 
    [contractors]
  )

  const availableContractors = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return contractors.filter(contractor => {
      if (!contractor.isActive) return false
      const todaySlots = getContractorAvailability(contractor.id, today)
      return todaySlots.some(slot => slot.status === AvailabilityStatus.AVAILABLE)
    })
  }, [contractors, availabilitySlots])

  const pendingJobs = useMemo(() => 
    contractorJobs.filter(job => job.status === ContractorJobStatus.PENDING), 
    [contractorJobs]
  )

  const assignedJobs = useMemo(() => 
    contractorJobs.filter(job => job.status === ContractorJobStatus.ASSIGNED), 
    [contractorJobs]
  )

  // Overall performance metrics
  const overallMetrics = useMemo(() => {
    const completedJobs = contractorJobs.filter(job => job.status === ContractorJobStatus.COMPLETED)
    const totalCompletedJobs = completedJobs.length

    const totalRatingSum = contractors.reduce((sum, c) => sum + c.ratings.averageRating, 0)
    const averageContractorRating = contractors.length > 0
      ? (totalRatingSum / contractors.length).toFixed(1)
      : '0.0'

    // This would require tracking actual time spent on jobs, which is not fully implemented yet
    // For now, we can use estimated duration for completed jobs as a placeholder
    const totalEstimatedDurationCompletedJobs = completedJobs.reduce((sum, job) => sum + job.estimatedDuration, 0)
    const averageJobDuration = totalCompletedJobs > 0
      ? (totalEstimatedDurationCompletedJobs / totalCompletedJobs).toFixed(1)
      : '0.0'

    return {
      totalCompletedJobs,
      averageContractorRating,
      averageJobDuration
    }
  }, [contractorJobs, contractors])

  return {
    // Data
    contractors,
    availabilitySlots,
    contractorJobs,
    loading,
    error,

    // Computed values
    activeContractors,
    availableContractors,
    pendingJobs,
    assignedJobs,
    overallMetrics,

    // Contractor functions
    getContractors,
    getContractorById,
    addContractor,
    updateContractor,
    deleteContractor,

    // Availability functions
    getContractorAvailability,
    addAvailabilitySlot,
    updateAvailabilitySlot,
    deleteAvailabilitySlot,

    // Job functions
    getContractorJobs,
    getJobById,
    getJobsByContractor,
    addContractorJob,
    updateContractorJob,
    assignJobToContractor,
    unassignJobFromContractor,
    deleteContractorJob,

    // Advanced features
    searchContractors,
    exportContractorData,
    bulkUpdateContractors,
    bulkDeleteContractors
  }
}