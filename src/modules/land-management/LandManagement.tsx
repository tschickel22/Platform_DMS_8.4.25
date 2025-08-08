import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react'
import { useLandManagement } from './hooks/useLandManagement'
import { LandList } from './components/LandList'
import { LandForm } from './components/LandForm'
import { LandDetail } from './components/LandDetail'

function LandOverview() {
  const { lands, stats } = useLandManagement()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Land Management</h1>
          <p className="text-muted-foreground">
            Manage your land inventory and development projects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Land
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableProperties}</div>
            <p className="text-xs text-muted-foreground">
              Ready for development
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Development</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inDevelopment}</div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Land Activity</CardTitle>
          <CardDescription>
            Latest updates on your land properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lands.slice(0, 5).map((land) => (
              <div key={land.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {land.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {land.address} - {land.status}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant={land.status === 'Available' ? 'default' : 'secondary'}>
                    {land.status}
                  </Badge>
                </div>
              </div>
            ))}
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