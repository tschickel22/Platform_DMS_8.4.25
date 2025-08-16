// Enhanced website templates with complete page structures
export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  category: 'rv_dealer' | 'manufactured_home' | 'general' | 'luxury'
  previewImage: string
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  pages: TemplatePageDefinition[]
  nav: {
    manufacturersMenu: {
      enabled: boolean
      label: string
      items: any[]
    }
    showLandHomeMenu?: boolean
    landHomeLabel?: string
  }
  seo: {
    siteDefaults: {
      title: string
      description: string
      robots: string
    }
  }
}

export interface TemplatePageDefinition {
  title: string
  path: string
  blocks: TemplateBlockDefinition[]
  seo?: {
    title?: string
    description?: string
  }
}

export interface TemplateBlockDefinition {
  type: string
  content: any
  order: number
}

export const websiteTemplates: WebsiteTemplate[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
]

export function getTemplateById(id: string): WebsiteTemplate | null {
}
export const siteTemplates = websiteTemplates
export const defaultTemplates = websiteTemplates
export { websiteTemplates as templates }

export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return websiteTemplates.filter(template => template.category === category)
}

export function createSiteFromTemplate(template: WebsiteTemplate, siteName: string, siteSlug: string): any {
  return {
    name: siteName,
    slug: siteSlug,
    theme: template.theme,
    nav: template.nav,
    seo: template.seo,
    pages: template.pages.map((page, index) => ({
      id: `page-${index + 1}`,
      title: page.title,
      path: page.path,
      order: index,
      seo: page.seo,
      blocks: page.blocks.map((block, blockIndex) => ({
        id: `block-${blockIndex + 1}`,
        type: block.type,
        content: block.content,
        order: block.order
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export { siteTemplates }