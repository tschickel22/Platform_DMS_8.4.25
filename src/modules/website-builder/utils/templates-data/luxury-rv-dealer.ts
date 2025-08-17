import { WebsiteTemplate } from '../templates'

export const luxuryRVDealerTemplate: WebsiteTemplate = {
  id: 'luxury-rv-dealer',
  name: 'Luxury RV Dealer',
  description: 'Premium luxury RV dealership with high-end inventory',
  category: 'luxury',
  previewImage: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=800',
  theme: {
    primaryColor: '#7c3aed',
    secondaryColor: '#64748b',
    fontFamily: 'Montserrat'
  },
  nav: {
    manufacturersMenu: {
      enabled: true,
      label: 'Premium Brands',
      items: []
    },
    showLandHomeMenu: false
  },
  seo: {
    siteDefaults: {
      title: 'Luxury RV Dealership - Premium Motorhomes & Coaches',
      description: 'Exclusive selection of luxury RVs, premium motorhomes, and high-end travel coaches. White-glove service and concierge support.',
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
            title: 'Luxury RV Excellence',
            subtitle: 'Discover the finest selection of premium motorhomes and luxury travel coaches',
            ctaText: 'Explore Collection',
            ctaLink: '/inventory',
            backgroundImage: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Uncompromising Quality</h2><p>Experience the pinnacle of RV luxury with our curated collection of premium motorhomes and travel coaches. Each vehicle in our inventory represents the finest in craftsmanship, innovation, and comfort.</p>',
            alignment: 'center'
          }
        },
        {
          type: 'inventory',
          order: 2,
          content: {
            title: 'Featured Luxury RVs',
            items: [
              {
                title: '2024 Newmar King Aire',
                price: 485000,
                image: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 4, length: 45, slides: 4 }
              },
              {
                title: '2023 Prevost H3-45',
                price: 750000,
                image: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 6, length: 45, slides: 3 }
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Collection',
      path: '/collection',
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Our Luxury Collection',
            subtitle: 'Handpicked premium RVs from the world\'s finest manufacturers',
            backgroundImage: 'https://images.pexels.com/photos/2339010/pexels-photo-2339010.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
            title: 'Concierge Services',
            subtitle: 'White-glove service for your luxury RV',
            backgroundImage: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Premium Services</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3>Concierge Maintenance</h3><ul><li>Pickup and delivery service</li><li>Detailed inspections</li><li>Premium parts only</li><li>Master technicians</li></ul></div><div><h3>Lifestyle Support</h3><ul><li>Trip planning assistance</li><li>Destination recommendations</li><li>Emergency roadside support</li><li>Owner events and rallies</li></ul></div></div>',
            alignment: 'left'
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
            html: '<h1>About Our Luxury Dealership</h1><p>For over 15 years, we\'ve specialized in the finest luxury RVs and motorcoaches. Our commitment to excellence extends beyond sales to encompass the entire ownership experience.</p>',
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
            title: 'Schedule Your Private Consultation',
            description: 'Experience our luxury collection with a private, personalized consultation.',
            phone: '(555) 999-8888',
            email: 'concierge@luxuryrvs.com',
            address: '789 Luxury Lane, Premium City, ST 67890'
          }
        }
      ]
    }
  ]
}