import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  FileText,
  Wrench,
  Truck,
  CheckSquare,
  Percent,
  Globe,
  Receipt,
  BarChart2,
  Settings,
  Shield,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ListTodo,
  Calendar,
  HardHat,
  MapPin,
  Tag,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MarketingMenuItems from '@/components/menu/MarketingMenuItems'

/**
 * ROUTE CONSTANTS
 * Keep admin paths under a namespace that can't collide with public dynamic routes like "/:companySlug/listings".
 * Your App.tsx should map these admin routes to protected components.
 */
const ROUTES = {
  DASHBOARD: '/',
  CRM: '/crm',
  DEALS: '/deals',
  QUOTES: '/quotes',

  INVENTORY: '/inventory',
  LAND: '/land',
  PDI: '/pdi',
  DELIVERY: '/delivery',
  WARRANTY: '/inventory/warranty',

  // ✅ Admin Property Listings dashboard (must exist in App.tsx)
  PROPERTY_LISTINGS_ADMIN: '/property/listings',
  // ✅ Marketing: Brochures
  BROCHURES: '/brochures',

  FINANCE: '/finance',
  AGREEMENTS: '/agreements',
  CLIENT_APPS: '/client-applications',
  INVOICES: '/invoices',

  SERVICE: '/service',
  PORTAL: '/portal',

  REPORTS: '/reports',
  COMMISSIONS: '/commissions',
  TAGS: '/tags',
  TASKS: '/tasks',
  CALENDAR: '/calendar',
  CONTRACTORS: '/contractors',

  SETTINGS: '/settings',
  PLATFORM_ADMIN: '/admin'
}

interface NavigationItem {
  name: string
  path?: string
  icon: React.ComponentType<any>
  children?: Array<{
    name: string
    path: string
    icon: React.ComponentType<any>
  }>
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // ---------- Navigation definition ----------
  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },

    {
      name: 'CRM & Sales',
      icon: Users,
      children: [
        { name: 'Prospecting', path: ROUTES.CRM, icon: Users },
        { name: 'Sales Deals', path: ROUTES.DEALS, icon: DollarSign },
        { name: 'Quotes', path: ROUTES.QUOTES, icon: FileText }
      ]
    },

    {
      name: 'Inventory & Operations',
      icon: Package,
      children: [
        { name: 'Inventory', path: ROUTES.INVENTORY, icon: Package },
        { name: 'Land Management', path: ROUTES.LAND, icon: MapPin },
        { name: 'PDI Checklist', path: ROUTES.PDI, icon: CheckSquare },
        { name: 'Delivery', path: ROUTES.DELIVERY, icon: Truck },
        { name: 'Warranty Mgmt', path: ROUTES.WARRANTY, icon: ShieldCheck }
      ]
    },

    // ✅ Marketing with the ADMIN Property Listings dashboard
    {
      name: 'Marketing',
      icon: Globe,
      children: [
        { name: 'Property Listings', path: ROUTES.PROPERTY_LISTINGS_ADMIN, icon: Home },
        { name: 'Brochures', path: ROUTES.BROCHURES, icon: FileText }
      ]
    },

    {
      name: 'Finance & Agreements',
      icon: DollarSign,
      children: [
        { name: 'Finance', path: ROUTES.FINANCE, icon: DollarSign },
        { name: 'Agreements', path: ROUTES.AGREEMENTS, icon: FileText },
        { name: 'Applications', path: ROUTES.CLIENT_APPS, icon: FileText },
        { name: 'Invoices', path: ROUTES.INVOICES, icon: Receipt }
      ]
    },

    {
      name: 'Service & Support',
      icon: Wrench,
      children: [
        { name: 'Service Ops', path: ROUTES.SERVICE, icon: Wrench },
        { name: 'Client Portal', path: ROUTES.PORTAL, icon: Globe }
      ]
    },

    {
      name: 'Management',
      icon: BarChart2,
      children: [
        { name: 'Reports', path: ROUTES.REPORTS, icon: BarChart2 },
        { name: 'Commissions', path: ROUTES.COMMISSIONS, icon: Percent },
        { name: 'Tag Manager', path: ROUTES.TAGS, icon: Tag },
        // 🚫 Removed the duplicate "Property Listings" entry that pointed at "/listings" (public route).
        { name: 'Task Center', path: ROUTES.TASKS, icon: ListTodo },
        { name: 'Calendar', path: ROUTES.CALENDAR, icon: Calendar },
        { name: 'Contractors', path: ROUTES.CONTRACTORS, icon: HardHat }
      ]
    },

    {
      name: 'Administration',
      icon: Settings,
      children: [
        { name: 'Company Settings', path: ROUTES.SETTINGS, icon: Settings },
        { name: 'Platform Admin', path: ROUTES.PLATFORM_ADMIN, icon: Shield }
      ]
    }
  ]

  // ---------- Helpers ----------
  const normalize = (p: string) => p.replace(/\/+$/, '')
  const isActive = (path: string) => {
    const current = normalize(location.pathname)
    const target = normalize(path)
    return current === target || current.startsWith(target + '/')
  }

  // Auto-expand the group that contains the current route
  useEffect(() => {
    const currentPath = normalize(location.pathname)
    const parent = navigationItems.find(item =>
      item.children?.some(child => {
        const target = normalize(child.path)
        return currentPath === target || currentPath.startsWith(target + '/')
      })
    )
    if (parent && !expandedMenus.includes(parent.name)) {
      setExpandedMenus(prev => [...prev, parent.name])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  // ---------- Sidebar ----------
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              {tenant?.name?.charAt(0) || 'R'}
            </span>
          </div>
          <span className="ml-2 text-lg font-semibold">
            {tenant?.name || 'Renter Insight'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigationItems.map((item) => {
          if (item.children) {
            const isExpanded = expandedMenus.includes(item.name)
            const hasActiveChild = item.children.some(child => isActive(child.path!))

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    'w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    hasActiveChild
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        hasActiveChild ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    {item.name}
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded ? 'transform rotate-180' : '',
                      hasActiveChild ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {item.children.map((child) => {
                      const childActive = isActive(child.path!)
                      return (
                        <Link
                          key={child.path}
                          to={child.path!}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'group flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
                            childActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <child.icon
                            className={cn(
                              'mr-3 flex-shrink-0 h-4 w-4',
                              childActive ? 'text-primary-foreground' : 'text-muted-foreground'
                            )}
                          />
                          {child.name}
                        </Link>
                      )
                    })}
                    {item.name === 'Marketing' && <MarketingMenuItems />}
                  </div>
                )}
              </div>
            )
          } else {
            const active = isActive(item.path!)
            return (
              <Link
                key={item.path}
                to={item.path!}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    active ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}
                />
                {item.name}
              </Link>
            )
          }
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                {tenant?.name?.charAt(0) || 'R'}
              </span>
            </div>
            <span className="ml-2 font-semibold">
              {tenant?.name || 'Renter Insight'}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
