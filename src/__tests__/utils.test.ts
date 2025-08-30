import { formatCurrency, formatDate, formatDateTime, generateId, debounce } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })
  })

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024/)
    })

    test('handles string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/Jan 15, 2024/)
    })
  })

  describe('formatDateTime', () => {
    test('formats date and time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDateTime(date)
      expect(formatted).toMatch(/Jan 15, 2024/)
      expect(formatted).toMatch(/\d{1,2}:\d{2} [AP]M/)
    })
  })

  describe('generateId', () => {
    test('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(5)
    })
  })

  describe('debounce', () => {
    test('debounces function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      // Call multiple times quickly
      debouncedFn('test1')
      debouncedFn('test2')
      debouncedFn('test3')
      
      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled()
      
      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // Should have been called once with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test3')
    })
  })
})