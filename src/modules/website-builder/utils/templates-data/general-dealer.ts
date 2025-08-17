import { WebsiteTemplate } from '../templates'

export const generalDealerTemplate: WebsiteTemplate = {
  id: 'general-dealer',
  name: 'General Dealer',
  description: 'Versatile template for any type of vehicle dealership',
  category: 'general',
  previewImage: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
  theme: {
    primaryColor: '#dc2626',
    secondaryColor: '#64748b',
    fontFamily: 'Inter'
  },
  nav: {
    manufacturersMenu: {
      enabled: true,
      label: 'Brands',
      items: []
    },
    showLandHomeMenu: false
  },
  seo: {
    siteDefaults: {
      title: 'Quality Vehicle Dealership - Sales & Service',
      description: 'Your trusted vehicle dealership for quality sales, service, and financing solutions.',
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
            title: 'Quality Vehicles, Exceptional Service',
            subtitle: 'Your trusted partner for vehicle sales, service, and financing',
            ctaText: 'Browse Inventory',
            ctaLink: '/inventory',
            backgroundImage: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Welcome to Our Dealership</h2><p>We\'re committed to providing quality vehicles and exceptional customer service. Our experienced team is here to help you find the perfect vehicle for your needs.</p>',
            alignment: 'center'
          }
        }
      ]
    },
    {
      title: 'Inventory',
      path: '/inventory',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Our Inventory',
            subtitle: 'Quality vehicles from trusted brands',
            backgroundImage: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        }
      ]
    },
    {
      title: 'Services',
      path: '/services',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Professional Services',
            subtitle: 'Expert maintenance and repair services',
            backgroundImage: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        }
      ]
    },
    {
      title: 'About',
      path: '/about',
      blocks: [
        {
          type: 'text',
          order: 0,
          content: {
            html: '<h1>About Us</h1><p>Our dealership has been serving the community with quality vehicles and exceptional service. We\'re committed to helping you find the perfect vehicle for your needs.</p>',
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
            description: 'Get in touch with our team for sales, service, or any questions.',
            phone: '(555) 555-5555',
            email: 'info@dealership.com',
            address: '123 Main Street, Anytown, ST 12345'
          }
        }
      ]
    }
  ]
}