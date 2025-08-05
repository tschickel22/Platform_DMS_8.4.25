import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { DispatchBoard } from './components/DispatchBoard'
import { ContractorDetail } from './components/ContractorDetail'
import { ContractorPortal } from './components/ContractorPortal'
import { ContractorAnalytics } from './components/ContractorAnalytics'
import { ContractorNotifications } from './components/ContractorNotifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Star,
  Calendar,
  MapPin,
  BarChart3,
  Bell
} from 'lucide-react'
import { useContractorManagement } from './hooks/useContractorManagement'
import { ContractorTrade, AvailabilityStatus } from '@/types'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NewContractorJobForm } from './components/NewContractorJobForm'
import { NewContractorForm } from './components/NewContractorForm'

// Helper function to get trade display name
const getTradeDisplayName = (trade: ContractorTrade): string => {
  const tradeNames: Record<ContractorTrade, string> = {
    [ContractorTrade.ELECTRICAL]: 'Electrical',
    [ContractorTrade.PLUMBING]: 'Plumbing',
    [ContractorTrade.SKIRTING]: 'Skirting',
    [ContractorTrade.HVAC]: 'HVAC',
    [ContractorTrade.FLOORING]: 'Flooring',
    [ContractorTrade.ROOFING]: 'Roofing',
    [ContractorTrade.GENERAL]: 'General',
    [ContractorTrade.LANDSCAPING]: 'Landscaping'
  }
  return tradeNames[trade] || trade
}

// Helper function to get availability status for today
const getContractorAvailabilityStatus = (contractorId: string, availabilitySlots: any[]) => {
  const today = new Date().toISOString().split('T')[0]
  const todaySlots = availabilitySlots.filter(slot => 
    slot.contractorId === contractorId && slot.date === today
  )
  
  if (todaySlots.length === 0) return 'No Schedule'
  
  const hasAvailable = todaySlots.some(slot => slot.status === AvailabilityStatus.AVAILABLE)
  const hasBooked = todaySlots.some(slot => slot.status === AvailabilityStatus.BOOKED)
  
  if (hasAvailable && hasBooked) return 'Partially Available'
  if (hasAvailable) return 'Available'
  if (hasBooked) return 'Fully Booked'
  
  return 'Unavailable'
}

// Helper function to get badge variant for availability status
const getAvailabilityBadgeVariant = (status: string) => {
  switch (status) {
    case 'Available':
      return 'default'
    case 'Partially Available':
      return 'secondary'
    case 'Fully Booked':
      return 'destructive'
    default:
      return 'outline'
  }
}

function ContractorDirectory() {
  const location = useLocation()
  const { 
    contractors, 
    availabilitySlots, 
    loading, 
    error,
    activeContractors 
  } = useContractorManagement()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTrade, setSelectedTrade] = useState<string>('all')
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isNewJobFormOpen, setIsNewJobFormOpen] = useState(false)
  const [isNewContractorFormOpen, setIsNewContractorFormOpen] = useState(false)

  // Filter contractors based on search and filters
  const filteredContractors = activeContractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.contactInfo.phone.includes(searchTerm) ||
                         (contractor.notes && contractor.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTrade = selectedTrade === 'all' || contractor.trade === selectedTrade
    
    let matchesAvailability = true
    if (selectedAvailability !== 'all') {
      const availabilityStatus = getContractorAvailabilityStatus(contractor.id, availabilitySlots)
      matchesAvailability = availabilityStatus === selectedAvailability
    }
    
    // Apply active filter from stats cards
    let matchesActiveFilter = true
    if (activeFilter) {
      switch (activeFilter) {
        case 'available':
          const availabilityStatus = getContractorAvailabilityStatus(contractor.id, availabilitySlots)
          matchesActiveFilter = availabilityStatus === 'Available'
          break
        case 'high-rated':
          matchesActiveFilter = contractor.ratings.averageRating >= 4.5
          break
        case 'with-reviews':
          matchesActiveFilter = contractor.ratings.reviewCount > 0
          break
        default:
          matchesActiveFilter = true
      }
    }
    
    return matchesSearch && matchesTrade && matchesAvailability && matchesActiveFilter
  })

  const handleStatsCardClick = (filterType: string) => {
    if (activeFilter === filterType) {
      // If clicking the same filter, clear it
      setActiveFilter(null)
    } else {
      // Set new filter and clear other filters
      setActiveFilter(filterType)
      setSelectedTrade('all')
      setSelectedAvailability('all')
      setSearchTerm('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <NewContractorJobForm
        isOpen={isNewJobFormOpen}
        onClose={() => setIsNewJobFormOpen(false)}
        onSuccess={() => { /* Optionally refresh data or show toast */ }}
      />
      <NewContractorForm
        isOpen={isNewContractorFormOpen}
        onClose={() => setIsNewContractorFormOpen(false)}
        onSuccess={() => { /* Optionally refresh data or show toast */ }}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Contractor Management</h1>
          <p className="ri-page-description">
            Manage your network of contractors and their availability
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2">
          <Link to="/contractors/directory">
            <Button variant={location.pathname.includes('/directory') || location.pathname === '/contractors' ? 'default' : 'outline'}>
              Directory
            </Button>
          </Link>
          <Link to="/contractors/dispatch">
            <Button variant={location.pathname.includes('/dispatch') ? 'default' : 'outline'}>
              Dispatch Board
            </Button>
          </Link>
          <Link to="/contractors/portal">
            <Button variant={location.pathname.includes('/portal') ? 'default' : 'outline'}>
              Contractor Portal
            </Button>
          </Link>
          <Link to="/contractors/analytics">
            <Button variant={location.pathname.includes('/analytics') ? 'default' : 'outline'}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link to="/contractors/notifications">
            <Button variant={location.pathname.includes('/notifications') ? 'default' : 'outline'}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </Link>
          <div className="border-l pl-2 ml-2">
            <Button onClick={() => setIsNewJobFormOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'total' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-blue-50 hover:bg-blue-100'
          }`}
          onClick={() => handleStatsCardClick('total')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-700">{filteredContractors.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeContractors.length} active
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'available' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-green-50 hover:bg-green-100'
          }`}
          onClick={() => handleStatsCardClick('available')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Today</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-700">
              {filteredContractors.filter(c => 
                getContractorAvailabilityStatus(c.id, availabilitySlots) === 'Available'
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for assignments
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'high-rated' ? 'bg-yellow-100 ring-2 ring-yellow-500' : 'bg-yellow-50 hover:bg-yellow-100'
          }`}
          onClick={() => handleStatsCardClick('high-rated')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-yellow-700">
              {filteredContractors.length > 0 
                ? (filteredContractors.reduce((sum, c) => sum + c.ratings.averageRating, 0) / filteredContractors.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {activeFilter === 'high-rated' ? '4.5+ rated contractors' : 'Across all contractors'}
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'with-reviews' ? 'bg-purple-100 ring-2 ring-purple-500' : 'bg-purple-50 hover:bg-purple-100'
          }`}
          onClick={() => handleStatsCardClick('with-reviews')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-purple-700">
              {filteredContractors.reduce((sum, c) => sum + c.ratings.reviewCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search contractors by name, email, phone, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input"
              />
            </div>
            
            {/* Trade Filter */}
            <Select value={selectedTrade} onValueChange={setSelectedTrade}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {Object.values(ContractorTrade).map(trade => (
                  <SelectItem key={trade} value={trade}>
                    {getTradeDisplayName(trade)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Availability Filter */}
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Partially Available">Partially Available</SelectItem>
                <SelectItem value="Fully Booked">Fully Booked</SelectItem>
                <SelectItem value="No Schedule">No Schedule</SelectItem>
                <SelectItem value="Unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Add Contractor Button */}
            <Button className="w-full sm:w-auto" onClick={() => setIsNewContractorFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contractors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contractors ({filteredContractors.length})</CardTitle>
          <CardDescription>
            {filteredContractors.length === contractors.length 
              ? 'Showing all contractors'
              : `Showing ${filteredContractors.length} of ${contractors.length} contractors`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContractors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No contractors found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Trade</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Today's Availability</TableHead>
                    <TableHead>Active Jobs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContractors.map((contractor) => {
                    const availabilityStatus = getContractorAvailabilityStatus(contractor.id, availabilitySlots)
                    
                    return (
                      <TableRow key={contractor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contractor.name}</div>
                            {contractor.contactInfo.address && (
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {contractor.contactInfo.address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTradeDisplayName(contractor.trade)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                              {contractor.contactInfo.phone}
                            </div>
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                              {contractor.contactInfo.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{contractor.ratings.averageRating}</span>
                            <span className="text-muted-foreground text-sm ml-1">
                              ({contractor.ratings.reviewCount})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAvailabilityBadgeVariant(availabilityStatus)}>
                            {availabilityStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium text-lg">{contractor.assignedJobIds.length}</span>
                            {contractor.assignedJobIds.length > 0 && (
                              <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-muted-foreground text-sm ml-1">jobs</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link to={`/contractors/contractor/${contractor.id}`}>
                              <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                                View Details
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                              Schedule
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ContractorManagement() {
  return (
    <Routes>
      <Route path="/" element={<ContractorDirectory />} />
      <Route path="/directory" element={<ContractorDirectory />} />
      <Route path="/dispatch" element={<DispatchBoard />} />
      <Route path="/portal" element={<ContractorPortal />} />
      <Route path="/analytics" element={<ContractorAnalytics />} />
      <Route path="/notifications" element={<ContractorNotifications />} />
      <Route path="/contractor/:id" element={<ContractorDetail />} />
    </Routes>
  )
}