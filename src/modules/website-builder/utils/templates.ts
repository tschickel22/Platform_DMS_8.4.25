import { SiteTemplate, BlockType } from '../types'

export const siteTemplates: SiteTemplate[] = [
  {
    id: 'rv-dealer',
    name: 'RV Dealer',
    description: 'Professional RV dealership website with inventory showcase',
    category: 'rv_dealer',
    preview: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
    pages: [
      {
        title: 'Home',
        path: '/',
        blocks: [
          {
            id: 'hero-1',
            type: BlockType.HERO,
            content: {
              title: 'Find Your Perfect RV',
              subtitle: 'Explore our extensive collection of quality recreational vehicles',
              backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200',
              ctaText: 'Browse Inventory',
              ctaLink: '/inventory'
            },
            order: 0
          },
          {
            id: 'inventory-1',
            type: BlockType.INVENTORY,
            content: {
              title: 'Featured RVs',
              subtitle: 'Check out our latest arrivals',
              limit: 6,
              filterType: 'rv'
            },
            order: 1
          }
        ],
        isVisible: true,
        order: 0
      },
      {
        title: 'Inventory',
        path: '/inventory',
        blocks: [
          {
            id: 'inventory-2',
            type: BlockType.INVENTORY,
            content: {
              title: 'Our Complete RV Inventory',
              subtitle: 'Browse all available recreational vehicles',
              showFilters: true
            },
            order: 0
          }
        ],
        isVisible: true,
        order: 1
      }
    ],
    theme: {
      id: 'rv-dealer-theme',
      name: 'RV Dealer',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section: '4rem',
        container: '1200px'
      }
    },
    nav: {
      manufacturersMenu: {
        enabled: true,
        label: 'Manufacturers',
        items: [],
        allowCustom: true
      },
      showLandHomeMenu: false
    }
  },
  {
    id: 'mh-park',
    name: 'Manufactured Home Park',
    description: 'Community-focused website for manufactured home parks',
    category: 'mh_park',
    preview: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
    pages: [
      {
        title: 'Home',
        path: '/',
        blocks: [
          {
            id: 'hero-2',
            type: BlockType.HERO,
            content: {
              title: 'Welcome to Our Community',
              subtitle: 'Discover quality manufactured homes in a friendly neighborhood',
              backgroundImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
              ctaText: 'View Available Homes',
              ctaLink: '/homes'
            },
            order: 0
          },
          {
            id: 'landhome-1',
            type: BlockType.LAND_HOME,
            content: {
              title: 'Land & Home Packages',
              subtitle: 'Complete packages with financing available',
              showPackages: true
            },
            order: 1
          }
        ],
        isVisible: true,
        order: 0
      }
    ],
    theme: {
      id: 'mh-park-theme',
      name: 'MH Park',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#dc2626',
        background: '#ffffff',
        text: '#111827'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section: '3rem',
        container: '1200px'
      }
    },
    nav: {
      manufacturersMenu: {
        enabled: true,
        label: 'Home Manufacturers',
        items: [],
        allowCustom: true
      },
      showLandHomeMenu: true,
      landHomeLabel: 'Land & Homes'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, simple website template',
    category: 'minimal',
    preview: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
    pages: [
      {
        title: 'Home',
        path: '/',
        blocks: [
          {
            id: 'text-1',
            type: BlockType.TEXT,
            content: {
              html: '<h1>Welcome</h1><p>This is a minimal website template.</p>',
              alignment: 'center'
            },
            order: 0
          }
        ],
        isVisible: true,
        order: 0
      }
    ],
    theme: {
      id: 'minimal-theme',
      name: 'Minimal',
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#000000'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section: '2rem',
        container: '800px'
      }
    },
    nav: {
      manufacturersMenu: {
        enabled: false,
        label: 'Brands',
        items: [],
        allowCustom: false
      }
    }
  }
]

export function getTemplateById(id: string): SiteTemplate | null {
  return siteTemplates.find(template => template.id === id) || null
}

export function getTemplatesByCategory(category: string): SiteTemplate[] {
  return siteTemplates.filter(template => template.category === category)
}