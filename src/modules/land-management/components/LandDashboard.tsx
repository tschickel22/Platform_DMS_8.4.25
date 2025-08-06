import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Plus, 
  List, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react'
import { useLandManagement } from '../hooks/useLandManagement'

export default function LandDashboard() {
  const { lands, getLandsByStatus, getTotalValue } = useLandManagement()

  const availableLands = getLandsByStatus('available')
  const pendingLands = getLandsByStatus('pending')
  const soldLands = getLandsByStatus('sold')
  const totalValue = getTotalValue()

  const recentLands = lands.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Land Management</h1>
          <p className="text-muted-foreground">
            Manage your land inventory and track sales performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/land/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Land Parcel
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/land/list">
              <List className="mr-2 h-4 w-4" />
              View All
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lands.length}</div>
            <p className="text-xs text-muted-foreground">
              Land parcels in inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableLands.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for sale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingLands.length}</div>
            <p className="text-xs text-muted-foreground">
              Under contract
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/land/new">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Plus className="mr-2 h-5 w-5 text-blue-600" />
                Add New Parcel
              </CardTitle>
              <CardDescription>
                Register a new land parcel in your inventory
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/land/list">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <List className="mr-2 h-5 w-5 text-green-600" />
                View All Parcels
              </CardTitle>
              <CardDescription>
                Browse and manage your complete land inventory
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
              Analytics
            </CardTitle>
            <CardDescription>
              View sales performance and market trends
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Land Parcels</CardTitle>
          <CardDescription>
            Latest additions to your land inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLands.length > 0 ? (
            <div className="space-y-4">
              {recentLands.map((land) => (
                <div key={land.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{land.name}</p>
                      <p className="text-sm text-muted-foreground">{land.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${land.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{land.size} acres</p>
                    </div>
                    <Badge variant={
                      land.status === 'available' ? 'default' :
                      land.status === 'pending' ? 'secondary' :
                      land.status === 'sold' ? 'destructive' : 'outline'
                    }>
                      {land.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/land/detail/${land.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No land parcels yet</p>
              <p className="text-sm">Add your first land parcel to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}