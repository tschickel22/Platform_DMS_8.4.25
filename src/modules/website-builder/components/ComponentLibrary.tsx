import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Type,
  Image as ImageIcon,
  Layout,
  MousePointer,
  Grid,
  Star,
  Users,
  Mail,
  Phone,
  Map,
  Share2,
  Grid3X3,
  Plus
} from 'lucide-react'
import { Block } from '../types'
import { generateId } from '@/lib/utils'

interface ComponentTemplate {
  id: string
  name: string
  description: string
  category: 'hero' | 'text' | 'media' | 'cta' | 'contact' | 'features' | 'social'
  icon: React.ComponentType<any>
  preview: string
  blockData: any
}

// Block types for adding new blocks
const blockTypes = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Large banner with title, subtitle, and call-to-action',
    icon: Layout,
    category: 'Layout'
  },
  {
    type: 'text',
    name: 'Text Block',
    description: 'Rich text content with formatting options',
    icon: Type,
    category: 'Content'
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Single image with caption and styling options',
    icon: ImageIcon,
    category: 'Media'
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Button or link to drive user actions',
    icon: MousePointer,
    category: 'Marketing'
  },
  {
    type: 'contact',
    name: 'Contact Info',
    description: 'Contact details and form',
    icon: Phone,
    category: 'Contact'
  },
  {
    type: 'inventory',
    name: 'Inventory Grid',
    description: 'Display inventory items in a grid layout',
    icon: Grid,
    category: 'Business'
  },
  {
    type: 'landHome',
    name: 'Land & Home Packages',
    description: 'Showcase land and home package deals',
    icon: Star,
    category: 'Business'
  },
  {
    type: 'google_map',
    name: 'Google Map',
    description: 'Embed a Google Map by address or coordinates',
    icon: Map,
    category: 'Contact'
  },
  {
    type: 'social_links',
    name: 'Social Links',
    description: 'Row or grid of social icons with links',
    icon: Share2,
    category: 'Marketing'
  },
  {
    type: 'multi_image_gallery',
    name: 'Multi-Image Gallery',
    description: 'Grid gallery with lightbox',
    icon: Grid3X3,
    category: 'Media'
  },
  {
    type: 'multi_text',
    name: 'Multi-Text Sections',
    description: 'Multiple text sections (1–3 columns)',
    icon: Type,
    category: 'Content'
  }
]

interface ComponentLibraryProps {
  onAddComponent: (template: ComponentTemplate) => void
  onAddBlock?: (blockType: string) => void
}

export default function ComponentLibrary({ onAddComponent, onAddBlock }: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState<'templates' | 'blocks'>('templates')

  const componentTemplates: ComponentTemplate[] = [
    // Hero Components
    {
      id: 'hero-centered',
      name: 'Centered Hero',
      description: 'Large centered hero with title, subtitle, and CTA',
      category: 'hero',
      icon: Layout,
      preview:
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'hero',
        content: {
          title: 'Welcome to Our Dealership',
          subtitle: 'Find your perfect RV or manufactured home',
          ctaText: 'Browse Inventory',
          ctaLink: '/inventory',
          backgroundImage:
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
          alignment: 'center',
        },
      },
    },
    {
      id: 'hero-split',
      name: 'Split Hero',
      description: 'Hero with content on left, image on right',
      category: 'hero',
      icon: Layout,
      preview:
        'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'hero',
        content: {
          title: 'Quality Homes & RVs',
          subtitle: 'Trusted dealership with over 20 years of experience',
          ctaText: 'Learn More',
          ctaLink: '/about',
          layout: 'split',
          image:
            'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
      },
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
          html:
            '<h2>Our Services</h2><p class="text-lg text-gray-600">Everything you need for your RV or manufactured home</p>',
          alignment: 'center',
        },
      },
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
          html:
            '<p>Add your content here. This is a standard paragraph that you can customize with your own text, formatting, and styling.</p>',
          alignment: 'left',
        },
      },
    },

    // Image / Media Components
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      description: 'Grid of images with captions',
      category: 'media',
      icon: Grid,
      preview:
        'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'gallery',
        content: {
          title: 'Our Inventory',
          images: [
            {
              src:
                'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'RV Image 1',
              caption: 'Travel Trailers',
            },
            {
              src:
                'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'RV Image 2',
              caption: 'Motorhomes',
            },
            {
              src:
                'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'Manufactured Home',
              caption: 'Manufactured Homes',
            },
          ],
        },
      },
    },
    {
      id: 'image-single',
      name: 'Single Image',
      description: 'Single image with optional caption',
      category: 'media',
      icon: ImageIcon,
      preview:
        'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=400',
      blockData: {
        type: 'image',
        content: {
          src:
            'https://images.pexels.com/photos/2356002/pexels-photo-2356002.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt: 'Featured Image',
          caption: 'Add your image caption here',
          alignment: 'center',
        },
      },
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
          alignment: 'center',
        },
      },
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
          showEmailInput: true,
        },
      },
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
          showForm: false,
        },
      },
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
          description: "We'll get back to you within 24 hours",
          showForm: true,
          formFields: ['name', 'email', 'phone', 'message'],
        },
      },
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
            { icon: 'star', title: 'Quality Guaranteed', description: 'All our vehicles undergo thorough inspection' },
            { icon: 'users', title: 'Expert Service', description: 'Our experienced team is here to help' },
            { icon: 'shield', title: 'Warranty Included', description: 'Comprehensive warranty on all purchases' },
          ],
        },
      },
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
              location: 'Austin, TX',
            },
            {
              name: 'Sarah Johnson',
              text: 'Found the perfect manufactured home for our family.',
              rating: 5,
              location: 'Dallas, TX',
            },
          ],
        },
      },
    },

    // ---- New: Social Links ---------------------------------------------------
    {
      id: 'social-links',
      name: 'Social Links',
      description: 'Row or grid of social icons with links',
      category: 'social',
      icon: Share2,
      preview: '',
      blockData: {
        type: 'social_links',
        content: {
          title: 'Follow Us',
          layout: 'row',
          align: 'left',
          size: 'md',
          links: [
            { platform: 'facebook', url: 'https://facebook.com/yourpage' },
            { platform: 'instagram', url: 'https://instagram.com/yourhandle' },
            { platform: 'x', url: 'https://x.com/yourhandle' },
          ],
        },
      },
    },

    // ---- New: Multi-Image Gallery -------------------------------------------
    {
      id: 'multi-image-gallery',
      name: 'Multi-Image Gallery',
      description: 'Grid gallery with lightbox',
      category: 'media',
      icon: ImageIcon,
      preview: '',
      blockData: {
        type: 'multi_image_gallery',
        content: {
          columns: 3,
          aspect: 'auto',
          images: [
            { src: 'https://picsum.photos/seed/1/800/600', alt: 'Photo 1' },
            { src: 'https://picsum.photos/seed/2/800/600', alt: 'Photo 2' },
            { src: 'https://picsum.photos/seed/3/800/600', alt: 'Photo 3' },
          ],
        },
      },
    },

    // ---- New: Multi-Text Sections -------------------------------------------
    {
      id: 'multi-text',
      name: 'Multi-Text Sections',
      description: 'Multiple text sections in 1–3 columns',
      category: 'text',
      icon: Type,
      preview: '',
      blockData: {
        type: 'multi_text',
        content: {
          columns: 3,
          showDividers: true,
          sections: [
            { heading: 'Fast Delivery', body: 'We ship nationwide within 7–10 days.' },
            { heading: 'Financing', body: 'Flexible plans available for qualified buyers.' },
            { heading: 'Warranty', body: 'All models include a 12-month limited warranty.' },
          ],
        },
      },
    },

    // ---- New: Google Map -----------------------------------------------------
    {
      id: 'google-map',
      name: 'Google Map',
      description: 'Embed a Google Map by address or coordinates',
      category: 'contact',
      icon: Map,
      preview: '',
      blockData: {
        type: 'google_map',
        content: {
          address: '1600 Amphitheatre Pkwy, Mountain View, CA',
          zoom: 14,
          height: 360,
        },
      },
    },
  ]

  const templateCategories = ['all', ...Array.from(new Set(componentTemplates.map(t => t.category)))]
  const blockCategories = ['all', ...Array.from(new Set(blockTypes.map(t => t.category)))]

  const filteredTemplates = componentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredBlocks = blockTypes.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddBlock = (blockType: string) => {
    if (onAddBlock) {
      onAddBlock(blockType)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Content</CardTitle>
        <CardDescription>Add components or blocks to your page</CardDescription>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant={activeTab === 'templates' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </Button>
          <Button
            variant={activeTab === 'blocks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('blocks')}
          >
            Basic Blocks
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {(activeTab === 'templates' ? templateCategories : blockCategories).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-3">
          {activeTab === 'templates' ? (
            filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border rounded-lg p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onAddComponent(template)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <template.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredBlocks.map(block => (
              <div
                key={block.type}
                className="border rounded-lg p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleAddBlock(block.type)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <block.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{block.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {block.description}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {block.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {(activeTab === 'templates' ? filteredTemplates : filteredBlocks).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Grid className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {activeTab} found</p>
            <p className="text-xs">Try adjusting your search or category filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}