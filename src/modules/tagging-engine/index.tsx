import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Tags, 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'

// Mock data for demonstration
const mockTags = [
  { id: '1', name: 'High Priority', color: '#ef4444', count: 45 },
  { id: '2', name: 'Customer Service', color: '#3b82f6', count: 32 },
  { id: '3', name: 'Sales Lead', color: '#10b981', count: 28 },
  { id: '4', name: 'Follow Up', color: '#f59e0b', count: 19 },
  { id: '5', name: 'VIP Customer', color: '#8b5cf6', count: 12 }
]

const mockTaggedItems = [
  { id: '1', title: 'Customer Inquiry - RV Rental', tags: ['Customer Service', 'Follow Up'], date: '2024-01-15' },
  { id: '2', title: 'Sales Opportunity - Luxury Coach', tags: ['Sales Lead', 'High Priority', 'VIP Customer'], date: '2024-01-14' },
  { id: '3', title: 'Service Request - Maintenance', tags: ['Customer Service'], date: '2024-01-13' }
]

function TaggingDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTags = mockTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Tagging Engine</h1>
          <p className="text-muted-foreground">
            Organize and categorize your data with intelligent tagging
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Tag
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTags.length}</div>
            <p className="text-xs text-muted-foreground">
              Active tagging system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagged Items</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTaggedItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items with tags applied
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Active auto-tagging rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Tags Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTags.map((tag) => (
          <Card key={tag.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge 
                  style={{ backgroundColor: tag.color, color: 'white' }}
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
                <span className="text-sm text-muted-foreground">{tag.count} items</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Last used: 2 days ago
                </div>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Tagged Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Tagged Items</CardTitle>
          <CardDescription>
            Latest items that have been tagged in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTaggedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="flex gap-2 mt-2">
                    {item.tags.map((tagName) => {
                      const tag = mockTags.find(t => t.name === tagName)
                      return (
                        <Badge 
                          key={tagName}
                          variant="secondary"
                          style={tag ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
                          className="text-xs"
                        >
                          {tagName}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TaggingEngine() {
  return (
    <Routes>
      <Route path="/" element={<TaggingDashboard />} />
      <Route path="/*" element={<TaggingDashboard />} />
    </Routes>
  )
}

// Export components for use in other modules
export { default as TagSelector } from './components/TagSelector'