import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Type,
  Image,
  Layout,
  MousePointer,
  Grid,
  Star,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Play,
  BarChart3
} from 'lucide-react'

interface ComponentTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<any>
  preview: string
  blockData: any
}

interface ComponentLibraryProps {
  onAddComponent: (blockData: any) => void
  onClose: () => void
}

export function ComponentLibrary({ onAddComponent, onClose }: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const componentTemplates: ComponentTemplate[] = [
    // Hero Components
    {
      id: 'hero-centered',
      name: 'Centered Hero',
      description: 'Large centered hero with title, subtitle, and CTA',
      category: 'hero',
      icon: Layout,
      preview: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'hero',
        content: {
          title: 'Welcome to Our Dealership',
          subtitle: 'Find your perfect RV or manufactured home',
          ctaText: 'Browse Inventory',
          ctaLink: '/inventory',
          backgroundImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
          alignment: 'center'
        }
      }
    },
    {
      id: 'hero-split',
      name: 'Split Hero',
      description: 'Hero with content on left, image on right',
      category: 'hero',
      icon: Layout,
      preview: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'hero',
        content: {
          title: 'Quality Homes & RVs',
          subtitle: 'Trusted dealership with over 20 years of experience',
          ctaText: 'Learn More',
          ctaLink: '/about',
          layout: 'split',
          image: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      }
    },

    // Text Components
    {
      id: 'text-heading',
      name: 'Section Heading',
      description: 'Large heading with optional subtitle',
      category: 'text',
      icon: Type,
      preview: '',
      blockData: {
        type: 'text',
        content: {
          html: '<h2>Our Services</h2><p class="text-lg text-gray-600">Everything you need for your RV or manufactured home</p>',
          alignment: 'center'
        }
      }
    },
    {
      id: 'text-paragraph',
      name: 'Paragraph Text',
      description: 'Standard paragraph text block',
      category: 'text',
      icon: Type,
      preview: '',
      blockData: {
        type: 'text',
        content: {
          html: '<p>Add your content here. This is a standard paragraph that you can customize with your own text, formatting, and styling.</p>',
          alignment: 'left'
        }
      }
    },

    // Image Components
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      description: 'Grid of images with captions',
      category: 'media',
      icon: Grid,
      preview: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'gallery',
        content: {
          title: 'Our Inventory',
          images: [
            {
              src: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'RV Image 1',
              caption: 'Travel Trailers'
            },
            {
              src: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'RV Image 2',
              caption: 'Motorhomes'
            },
            {
              src: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'Manufactured Home',
              caption: 'Manufactured Homes'
            }
          ]
        }
      }
    },
    {
      id: 'image-single',
      name: 'Single Image',
      description: 'Single image with optional caption',
      category: 'media',
      icon: Image,
      preview: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'image',
        content: {
          src: 'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Featured Image',
          caption: 'Add your image caption here',
          alignment: 'center'
        }
      }
    },

    // CTA Components
    {
      id: 'cta-centered',
      name: 'Centered CTA',
      description: 'Call-to-action with centered layout',
      category: 'cta',
      icon: MousePointer,
      preview: '',
      blockData: {
        type: 'cta',
        content: {
          title: 'Ready to Find Your Perfect Home?',
          description: 'Browse our extensive inventory of RVs and manufactured homes',
          buttonText: 'View Inventory',
          buttonLink: '/inventory',
          alignment: 'center'
        }
      }
    },
    {
      id: 'cta-newsletter',
      name: 'Newsletter Signup',
      description: 'Email capture with call-to-action',
      category: 'cta',
      icon: Mail,
      preview: '',
      blockData: {
        type: 'cta',
        content: {
          title: 'Stay Updated',
          description: 'Get notified about new inventory and special offers',
          buttonText: 'Subscribe',
          buttonLink: '#newsletter',
          showEmailInput: true
        }
      }
    },

    // Contact Components
    {
      id: 'contact-info',
      name: 'Contact Information',
      description: 'Business contact details',
      category: 'contact',
      icon: Phone,
      preview: '',
      blockData: {
        type: 'contact',
        content: {
          title: 'Contact Us',
          description: 'Get in touch with our team',
          phone: '(555) 123-4567',
          email: 'info@dealership.com',
          address: '123 Main Street, City, State 12345',
          showForm: false
        }
      }
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      description: 'Contact form with message field',
      category: 'contact',
      icon: Mail,
      preview: '',
      blockData: {
        type: 'contact',
        content: {
          title: 'Send us a Message',
          description: 'We\'ll get back to you within 24 hours',
          showForm: true,
          formFields: ['name', 'email', 'phone', 'message']
        }
      }
    },

    // Features Components
    {
      id: 'features-grid',
      name: 'Features Grid',
      description: '3-column feature highlights',
      category: 'features',
      icon: Star,
      preview: '',
      blockData: {
        type: 'features',
        content: {
          title: 'Why Choose Us',
          features: [
            {
              icon: 'star',
              title: 'Quality Guaranteed',
              description: 'All our vehicles undergo thorough inspection'
            },
            {
              icon: 'users',
              title: 'Expert Service',
              description: 'Our experienced team is here to help'
            },
            {
              icon: 'shield',
              title: 'Warranty Included',
              description: 'Comprehensive warranty on all purchases'
            }
          ]
        }
      }
    },

    // Testimonials
    {
      id: 'testimonials',
      name: 'Customer Testimonials',
      description: 'Customer reviews and testimonials',
      category: 'social',
      icon: Users,
      preview: '',
      blockData: {
        type: 'testimonials',
        content: {
          title: 'What Our Customers Say',
          testimonials: [
            {
              name: 'John Smith',
              text: 'Excellent service and quality RVs. Highly recommended!',
              rating: 5,
              location: 'Austin, TX'
            },
            {
              name: 'Sarah Johnson',
              text: 'Found the perfect manufactured home for our family.',
              rating: 5,
              location: 'Dallas, TX'
            }
          ]
        }
      }
    }
  ]

  const categories = [
    { id: 'all', name: 'All Components', icon: Grid },
    { id: 'hero', name: 'Hero Sections', icon: Layout },
    { id: 'text', name: 'Text & Content', icon: Type },
    { id: 'media', name: 'Images & Media', icon: Image },
    { id: 'cta', name: 'Call to Action', icon: MousePointer },
    { id: 'contact', name: 'Contact', icon: Phone },
    { id: 'features', name: 'Features', icon: Star },
    { id: 'social', name: 'Social Proof', icon: Users }
  ]

  const filteredComponents = componentTemplates.filter(component => {
    const matchesSearch = searchTerm === '' || 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Component Library</CardTitle>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex">
            {/* Categories Sidebar */}
            <div className="w-64 border-r bg-gray-50 p-4">
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Components Grid */}
            <div className="flex-1 p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {filteredComponents.map((component) => (
                  <Card 
                    key={component.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      onAddComponent(component.blockData)
                      onClose()
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <component.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{component.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {component.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {component.preview && (
                        <div className="mb-3">
                          <img 
                            src={component.preview} 
                            alt={component.name}
                            className="w-full h-20 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        {component.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredComponents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No components found</p>
                  <p className="text-sm">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}