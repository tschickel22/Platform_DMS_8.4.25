import { WebsiteTemplate } from '../templates'

export const rvDealerProfessionalTemplate: WebsiteTemplate = {
  id: 'rv-dealer-professional',
  name: 'RV Dealer Professional',
  description: 'Professional RV dealership website with inventory showcase',
  category: 'rv_dealer',
  previewImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    fontFamily: 'Inter'
  },
  nav: {
    manufacturersMenu: {
      enabled: true,
      label: 'Manufacturers',
      items: []
    },
    showLandHomeMenu: false
  },
  seo: {
    siteDefaults: {
      title: 'Premier RV Dealership - Quality RVs & Service',
      description: 'Discover our extensive selection of quality RVs, motorhomes, and travel trailers. Expert service and financing available.',
      robots: 'index, follow'
    }
  },
  pages: [
    {
      title: 'Home',
      path: '/',
      seo: {
        title: 'Premier RV Dealership - Quality RVs & Service',
        description: 'Discover our extensive selection of quality RVs, motorhomes, and travel trailers. Expert service and financing available.'
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Find Your Perfect RV Adventure',
            subtitle: 'Explore our extensive selection of quality RVs, motorhomes, and travel trailers',
            ctaText: 'Browse Inventory',
            ctaLink: '/inventory',
            backgroundImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Welcome to Our RV Dealership</h2><p>For over 20 years, we\'ve been helping families discover the freedom of RV travel. Our extensive inventory includes motorhomes, travel trailers, fifth wheels, and toy haulers from top manufacturers.</p>',
            alignment: 'center'
          }
        },
        {
          type: 'inventory',
          order: 2,
          content: {
            title: 'Featured RVs',
            items: [
              {
                title: '2023 Forest River Cherokee',
                price: 45000,
                image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 4, length: 28, slides: 1 }
              },
              {
                title: '2022 Jayco Jay Flight',
                price: 38000,
                image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 6, length: 32, slides: 1 }
              },
              {
                title: '2024 Grand Design Solitude',
                price: 85000,
                image: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 6, length: 35, slides: 3 }
              }
            ]
          }
        },
        {
          type: 'cta',
          order: 3,
          content: {
            title: 'Ready to Start Your Adventure?',
            description: 'Contact us today to schedule a tour of our inventory or discuss financing options.',
            buttonText: 'Contact Us',
            buttonLink: '/contact'
          }
        }
      ]
    },
    {
      title: 'About Us',
      path: '/about',
      seo: {
        title: 'About Us - Premier RV Dealership',
        description: 'Learn about our family-owned RV dealership, our commitment to quality, and our experienced team.'
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'About Our Dealership',
            subtitle: 'Family-owned and operated since 2003',
            backgroundImage: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Our Story</h2><p>Founded in 2003, our family-owned dealership has been serving RV enthusiasts for over two decades. We started with a simple mission: to help families create lasting memories through RV travel.</p><p>Today, we\'re proud to be one of the region\'s most trusted RV dealers, offering an extensive selection of new and pre-owned RVs, comprehensive service, and expert financing options.</p>',
            alignment: 'left'
          }
        },
        {
          type: 'text',
          order: 2,
          content: {
            html: '<h2>Our Commitment</h2><ul><li>Quality RVs from trusted manufacturers</li><li>Expert service and maintenance</li><li>Competitive financing options</li><li>Exceptional customer service</li><li>Ongoing support for your RV journey</li></ul>',
            alignment: 'left'
          }
        },
        {
          type: 'gallery',
          order: 3,
          content: {
            title: 'Our Facility',
            images: [
              {
                src: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400',
                alt: 'Our showroom',
                caption: 'Modern showroom facility'
              },
              {
                src: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=400',
                alt: 'Service department',
                caption: 'Full-service department'
              },
              {
                src: 'https://images.pexels.com/photos/2356086/pexels-photo-2356086.jpeg?auto=compress&cs=tinysrgb&w=400',
                alt: 'Parts department',
                caption: 'Extensive parts inventory'
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Inventory',
      path: '/inventory',
      seo: {
        title: 'RV Inventory - Motorhomes, Travel Trailers & More',
        description: 'Browse our extensive inventory of new and pre-owned RVs including motorhomes, travel trailers, fifth wheels, and toy haulers.'
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Our RV Inventory',
            subtitle: 'Discover your next adventure with our extensive selection',
            backgroundImage: 'https://images.pexels.com/photos/2356086/pexels-photo-2356086.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'inventory',
          order: 1,
          content: {
            title: 'Available RVs',
            items: [
              {
                title: '2023 Forest River Cherokee 274RK',
                price: 45000,
                image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 4, length: 28, slides: 1, year: 2023, make: 'Forest River', model: 'Cherokee 274RK' }
              },
              {
                title: '2022 Jayco Jay Flight 28BHS',
                price: 38000,
                image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 6, length: 32, slides: 1, year: 2022, make: 'Jayco', model: 'Jay Flight 28BHS' }
              },
              {
                title: '2024 Grand Design Solitude 310GK',
                price: 85000,
                image: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 6, length: 35, slides: 3, year: 2024, make: 'Grand Design', model: 'Solitude 310GK' }
              },
              {
                title: '2023 Thor Ace 32.3',
                price: 125000,
                image: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 8, length: 32, slides: 2, year: 2023, make: 'Thor', model: 'Ace 32.3' }
              },
              {
                title: '2022 Winnebago Minnie 2529RG',
                price: 42000,
                image: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 5, length: 29, slides: 1, year: 2022, make: 'Winnebago', model: 'Minnie 2529RG' }
              },
              {
                title: '2021 Keystone Montana 3761FL',
                price: 72000,
                image: 'https://images.pexels.com/photos/2356086/pexels-photo-2356086.jpeg?auto=compress&cs=tinysrgb&w=400',
                specs: { sleeps: 6, length: 37, slides: 4, year: 2021, make: 'Keystone', model: 'Montana 3761FL' }
              }
            ]
          }
        }
      ]
    },
    {
      title: 'Services',
      path: '/services',
      seo: {
        title: 'RV Services - Maintenance, Repair & Parts',
        description: 'Professional RV service, maintenance, and repair. Certified technicians and genuine parts for all RV brands.'
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Expert RV Services',
            subtitle: 'Professional maintenance and repair by certified technicians',
            backgroundImage: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Our Services</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3>Maintenance Services</h3><ul><li>Annual inspections</li><li>Oil changes</li><li>Brake service</li><li>Tire rotation</li><li>Winterization</li></ul></div><div><h3>Repair Services</h3><ul><li>Engine repair</li><li>Electrical systems</li><li>Plumbing</li><li>HVAC service</li><li>Appliance repair</li></ul></div></div>',
            alignment: 'left'
          }
        },
        {
          type: 'cta',
          order: 2,
          content: {
            title: 'Schedule Your Service Today',
            description: 'Our certified technicians are ready to keep your RV in top condition.',
            buttonText: 'Schedule Service',
            buttonLink: '/contact'
          }
        }
      ]
    },
    {
      title: 'Financing',
      path: '/financing',
      seo: {
        title: 'RV Financing - Competitive Rates & Easy Approval',
        description: 'Get pre-approved for RV financing with competitive rates and flexible terms. Multiple lenders and financing options available.'
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'RV Financing Made Easy',
            subtitle: 'Competitive rates and flexible terms to fit your budget',
            backgroundImage: 'https://images.pexels.com/photos/2339010/pexels-photo-2339010.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'text',
          order: 1,
          content: {
            html: '<h2>Financing Options</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="text-center p-6 border rounded-lg"><h3>Traditional Financing</h3><p>Competitive rates starting at 5.99% APR</p><p>Terms up to 20 years</p></div><div class="text-center p-6 border rounded-lg"><h3>Extended Terms</h3><p>Lower monthly payments</p><p>Flexible down payment options</p></div><div class="text-center p-6 border rounded-lg"><h3>Quick Approval</h3><p>Get pre-approved in minutes</p><p>Multiple lender network</p></div></div>',
            alignment: 'center'
          }
        },
        {
          type: 'cta',
          order: 2,
          content: {
            title: 'Get Pre-Approved Today',
            description: 'Start your RV financing application and get approved in minutes.',
            buttonText: 'Apply Now',
            buttonLink: '/contact'
          }
        }
      ]
    },
    {
      title: 'Contact',
      path: '/contact',
      seo: {
        title: 'Contact Us - RV Dealership',
        description: 'Visit our showroom, call us, or send a message. We\'re here to help you find the perfect RV for your adventures.'
      },
      blocks: [
        {
          type: 'hero',
          order: 0,
          content: {
            title: 'Contact Us',
            subtitle: 'We\'re here to help you find your perfect RV',
            backgroundImage: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
        },
        {
          type: 'contact',
          order: 1,
          content: {
            title: 'Get in Touch',
            description: 'Visit our showroom, give us a call, or send us a message. Our experienced team is ready to help you find the perfect RV.',
            phone: '(555) 123-4567',
            email: 'info@rvdealership.com',
            address: '123 RV Boulevard, Anytown, ST 12345'
          }
        }
      ]
    }
  ]
}