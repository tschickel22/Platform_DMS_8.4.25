import { WebsiteTemplate } from '../templates'

export const manufacturedHomeDealerTemplate: WebsiteTemplate = {
  id: 'manufactured-home-dealer',
  name: 'Manufactured Home Dealer',
  description: 'Professional manufactured home dealership with land/home packages',
  category: 'manufactured_home',
  previewImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
  theme: {
    primaryColor: '#059669',
    secondaryColor: '#64748b',
    fontFamily: 'Inter'
  },
  nav: {
    manufacturersMenu: {
      enabled: true,
      label: 'Home Builders',
      items: []
    },
    showLandHomeMenu: true,
    landHomeLabel: 'Land + Home Packages'
  },
  seo: {
    siteDefaults: {
      title: 'Quality Manufactured Homes - Land & Home Packages',
      description: 'Discover quality manufactured homes and land packages. Expert installation and financing available.',
      robots: 'index, follow'
    }
  },
  pages: [
    {
      title: 'Home',
      path: '/',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Your Dream Home Awaits',
            subtitle: 'Quality manufactured homes with land packages and expert installation',
            ctaText: 'View Homes',
            ctaLink: '/homes',
            backgroundImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'landHome',
          order: 1,
          content: {
            title: 'Featured Land + Home Packages',
            packages: [
              {
                title: 'Starter Home Package',
                price: 85000,
                image: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Perfect for first-time buyers',
                features: ['2BR/1BA home', 'Standard lot', 'Basic setup', 'Financing available']
              },
              {
                title: 'Family Home Package',
                price: 120000,
                image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Spacious home for growing families',
                features: ['3BR/2BA home', 'Premium lot', 'Complete setup', 'Landscaping included']
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Homes',
      path: '/homes',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Quality Manufactured Homes',
            subtitle: 'Browse our selection of new and pre-owned homes',
            backgroundImage: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'inventory',
          order: 1,
          content: {
            title: 'Available Homes',
            items: [
              {
                title: '2023 Clayton The Edge',
                price: 95000,
                image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { bedrooms: 3, bathrooms: 2, sqft: 1450, year: 2023, make: 'Clayton', model: 'The Edge' }
              },
              {
                title: '2022 Champion Titan',
                price: 75000,
                image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { bedrooms: 4, bathrooms: 2, sqft: 1800, year: 2022, make: 'Champion', model: 'Titan' }
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Land Packages',
      path: '/land',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Available Land',
            subtitle: 'Premium lots ready for your new home',
            backgroundImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'landHome',
          order: 1,
          content: {
            title: 'Available Lots',
            packages: [
              {
                title: 'Premium Corner Lot #42',
                price: 25000,
                image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Beautiful corner lot with utilities',
                features: ['Water hookup', 'Sewer connection', 'Electric service', 'Corner location']
              },
              {
                title: 'Waterfront Lot #15',
                price: 35000,
                image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
                description: 'Stunning waterfront lot with dock access',
                features: ['Waterfront', 'Private dock', 'All utilities', 'Paved access']
              }
            ]
          }
        }
      ]
    },
    {
      title: 'About',
      path: '/about',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'About Our Company',
            subtitle: 'Helping families find quality homes since 1995',
            backgroundImage: 'https://images.pexels.com/photos/2462014/pexels-photo-2462014.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Our Mission</h2><p>We believe everyone deserves a quality home. For nearly 30 years, we\'ve been helping families find affordable, well-built manufactured homes in beautiful communities.</p><p>Our experienced team guides you through every step of the process, from selecting your home to finding the perfect lot and handling all installation details.</p>',
            alignment: 'center'
          }
        }
      ]
    },
    {
      title: 'Contact',
      path: '/contact',
      blocks: [
        {
          type: 'contact',
          order: 0,
          content: {
            title: 'Contact Us',
            description: 'Ready to find your new home? Contact us today to schedule a tour or discuss your options.',
            phone: '(555) 987-6543',
            email: 'info@qualityhomes.com',
            address: '456 Home Center Drive, Hometown, ST 54321'
          }
        }
      ]
    }
  ]
}