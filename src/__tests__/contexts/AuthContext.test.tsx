import { renderHook, act } from "@testing-library/react"
import React from "react"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  test('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  test('successful login updates user state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.login('admin@renterinsight.com', 'password')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe('admin@renterinsight.com')
    expect(result.current.user?.name).toBe('Admin User')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-token')
  })

  test('failed login throws error', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await expect(
      act(async () => {
        await result.current.login('wrong@email.com', 'wrongpassword')
      })
    ).rejects.toThrow('Login failed')

    expect(result.current.user).toBeNull()
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
  })

  test('logout clears user state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // First login
    await act(async () => {
      await result.current.login('admin@renterinsight.com', 'password')
    })

    expect(result.current.user).not.toBeNull()

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token')
  })

  test('hasPermission works correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.login('admin@renterinsight.com', 'password')
    })

    expect(result.current.hasPermission('crm', 'read')).toBe(true)
    expect(result.current.hasPermission('any', 'any')).toBe(true) // Admin has all access
  })

  test('restores session from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('existing-token')
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe('admin@renterinsight.com')
  })
})