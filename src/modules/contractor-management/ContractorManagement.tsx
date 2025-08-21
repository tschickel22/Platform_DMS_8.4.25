import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HardHat, Plus, Users, Wrench } from 'lucide-react'

export default function ContractorManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contractor Management</h1>
        <p className="text-muted-foreground">
          Manage contractors and service providers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardHat className="h-5 w-5 mr-2" />
              Add Contractor
            </CardTitle>
            <CardDescription>
              Register new contractors and service providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Contractors
            </CardTitle>
            <CardDescription>
              View and manage active contractors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">contractors registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Active Jobs
            </CardTitle>
            <CardDescription>
              Current contractor assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">jobs in progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contractor Directory</CardTitle>
          <CardDescription>
            Manage your network of contractors and service providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <HardHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No contractors registered yet</p>
            <p className="text-sm">Add contractors to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}