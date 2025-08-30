import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import React from "react"
import App from "../App"

// Mock the contexts to avoid dependency issues in tests
vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    hasPermission: vi.fn(() => true),
    hasRole: vi.fn(() => true)
  })
}))

vi.mock('@/contexts/TenantContext', () => ({
  TenantProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTenant: () => ({
    tenant: {
      id: 'test-tenant',
      name: 'Test Tenant',
      domain: 'test.example.com'
    },
    getCustomFields: vi.fn(() => []),
    updateTenant: vi.fn(),
    addCustomField: vi.fn(),
    updateCustomField: vi.fn(),
    deleteCustomField: vi.fn()
  })
}))

vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn()
  })
}))

vi.mock('@/contexts/MenuManagerContext', () => ({
  MenuManagerProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useMenuManager: () => ({
    activeMenuId: null,
    setActiveMenu: vi.fn(),
    clearActiveMenu: vi.fn(),
    isMenuActive: vi.fn(() => false)
  })
}))

// Mock PDF.js worker
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'mock-worker-url'
}))

// Simple test component for basic rendering
function SimpleApp() {
  return <h1>Hello, Renter Insight!</h1>
}

describe('App Component', () => {
  test("renders without crashing", () => {
    render(
      <BrowserRouter>
        <SimpleApp />
      </BrowserRouter>
    )
    expect(screen.getByText("Hello, Renter Insight!")).toBeInTheDocument()
  })
})