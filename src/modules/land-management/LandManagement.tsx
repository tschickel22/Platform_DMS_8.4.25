import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  TrendingUp, 
  Building, 
  DollarSign,
  Plus,
  Activity,
  BarChart3,
  Map
} from 'lucide-react'
import { useLandManagement, type LandStats, type LandActivity } from './hooks/useLandManagement'
import { LandList } from './components/LandList'
import { LandForm } from './components/LandForm'
import { LandDetail } from './components/LandDetail'

function LandOverview() {
  const { stats, activity, loading } = useLandManagement()
  
  // Ensure stats has default values to prevent undefined errors
  const safeStats: LandStats = {
    totalProperties: 0,
    totalValue: 0,
    availableProperties: 0,
    occupiedProperties: 0,
    developmentProperties: 0,
    soldProperties: 0,
    totalAcreage: 0,
    averageValuePerAcre: 0,
    ...stats
  }
  
  const safeActivity: LandActivity[] = activity || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading land data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Land Management</h1>
          <p className="text-muted-foreground">
            Manage your land inventory and development projects
          </p>
        </div>
        <Button asChild>
          <Link to="/land/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Land
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {safeStats.availableProperties} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(safeStats.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              Portfolio value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Acreage</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalAcreage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Total acres
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Value/Acre</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(safeStats.averageValuePerAcre / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Per acre average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates on your land properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          {safeActivity.length > 0 ? (
            <div className="space-y-4">
              {safeActivity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant={item.type === 'success' ? 'default' : 'secondary'}>
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for land management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/land/list" className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View All Properties</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/land/new" className="flex flex-col items-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add New Property</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-6 w-6" />
                <span>Map View</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LandManagement() {
  return (
    <div className="container mx-auto p-6">
      <Routes>
        <Route path="/" element={<LandOverview />} />
        <Route path="/list" element={<LandList />} />
        <Route path="/new" element={<LandForm />} />
        <Route path="/edit/:id" element={<LandForm />} />
        <Route path="/detail/:id" element={<LandDetail />} />
        <Route path="*" element={<Navigate to="/land/" replace />} />
      </Routes>
    </div>
  )
}