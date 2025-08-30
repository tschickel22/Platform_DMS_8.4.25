import { renderHook, act } from "@testing-library/react"
import { useTasks } from "@/hooks/useTasks"

// Mock the dependencies
vi.mock('@/modules/crm-prospecting/hooks/useLeadManagement', () => ({
  useLeadManagement: () => ({
    leads: [
      {
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '555-1234',
        status: 'new',
        source: 'website',
        score: 85,
        lastActivity: '2024-01-20T14:30:00Z',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        notes: 'Interested in RV',
        assignedTo: 'rep-1',
        customFields: {}
      }
    ],
    salesReps: [
      { id: 'rep-1', name: 'Sales Rep 1' }
    ]
  })
}))

vi.mock('@/modules/service-ops/hooks/useServiceManagement', () => ({
  useServiceManagement: () => ({
    tickets: [
      {
        id: 'ticket-1',
        title: 'AC Repair',
        description: 'AC not working',
        status: 'open',
        priority: 'high',
        customerId: 'cust-1',
        vehicleId: 'veh-1',
        assignedTo: 'tech-1',
        scheduledDate: new Date('2024-01-25T10:00:00Z'),
        parts: [],
        labor: [],
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-20T09:00:00Z'
      }
    ]
  })
}))

vi.mock('@/lib/utils', () => ({
  saveToLocalStorage: vi.fn(),
  loadFromLocalStorage: vi.fn(() => [])
}))

describe('useTasks Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('loads and aggregates tasks from different sources', async () => {
    const { result } = renderHook(() => useTasks())
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.tasks).toHaveLength(2) // 1 lead + 1 service ticket
    expect(result.current.error).toBeNull()
  })

  test('calculates metrics correctly', async () => {
    const { result } = renderHook(() => useTasks())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const { metrics } = result.current
    expect(metrics.totalTasks).toBe(2)
    expect(metrics.pendingTasks).toBeGreaterThan(0)
    expect(metrics.tasksByModule).toBeDefined()
  })

  test('creates new task successfully', async () => {
    const { result } = renderHook(() => useTasks())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const initialTaskCount = result.current.tasks.length

    await act(async () => {
      await result.current.createTask({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date('2024-02-01T10:00:00Z')
      })
    })

    expect(result.current.tasks).toHaveLength(initialTaskCount + 1)
    const newTask = result.current.tasks.find(t => t.title === 'Test Task')
    expect(newTask).toBeDefined()
    expect(newTask?.description).toBe('Test Description')
  })

  test('filters tasks correctly', async () => {
    const { result } = renderHook(() => useTasks())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const crmTasks = result.current.getTasksByModule('crm' as any)
    expect(crmTasks.length).toBeGreaterThan(0)
    expect(crmTasks.every(task => task.module === 'crm')).toBe(true)
  })
})