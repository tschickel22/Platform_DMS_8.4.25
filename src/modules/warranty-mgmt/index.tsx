import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Plus, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { WarrantyClaimList } from './components/WarrantyClaimList';
import { WarrantyClaimDetail } from './components/WarrantyClaimDetail';
import { useWarrantyManagement } from './hooks/useWarrantyManagement';
import { WarrantyClaimForm } from './components/WarrantyClaimForm'

export default function WarrantyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'claims' | 'analytics'>('dashboard')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'denied' | 'rejected'>('all')

  // Helper function to apply tile filters
  const applyTileFilter = (status: 'all' | 'pending' | 'approved' | 'denied' | 'rejected') => {
    setActiveTab('claims')
    setStatusFilter(status)
  }

  const tileProps = (handler: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handler() },
  })

  const handleNewClaim = () => {
    setIsNewClaimOpen(true)
  }
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const { claims, loading, createClaim, updateClaim } = useWarrantyManagement();

  const filteredClaims = claims
    .filter(claim =>
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.vehicleVin.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(claim => statusFilter === 'all' || claim.status.toLowerCase() === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'processing': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (selectedClaim) {
    return (
      <WarrantyClaimDetail
        claimId={selectedClaim}
        onBack={() => setSelectedClaim(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Warranty Management</h1>
          <p className="text-muted-foreground">
            Manage warranty claims and coverage
          </p>
        </div>
        <Dialog open={isNewClaimOpen} onOpenChange={setIsNewClaimOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Warranty Claim</DialogTitle>
            </DialogHeader>
            <div className="w-full overflow-hidden">
              <WarrantyClaimForm 
                onSubmit={(data) => {
                  console.log('New claim data:', data)
                  setIsNewClaimOpen(false)
                }}
                onCancel={() => setIsNewClaimOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card {...tileProps(() => applyTileFilter('all'))} className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{claims.length}</div>
            <p className="text-xs text-blue-600">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card {...tileProps(() => applyTileFilter('pending'))} className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {claims.filter(c => c.status === 'pending').length}
            </div>
            <p className="text-xs text-yellow-600">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card {...tileProps(() => applyTileFilter('approved'))} className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Approved Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {claims.filter(c => c.status === 'approved').length}
            </div>
            <p className="text-xs text-green-600">
              Ready for processing
            </p>
          </CardContent>
        </Card>
        <Card {...tileProps(() => applyTileFilter('denied'))} className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Claim Value</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              ${claims.reduce((sum, claim) => sum + claim.claimAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-red-600">
              Total claim value
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Warranty Claims</CardTitle>
            <CardDescription>
              View and manage all warranty claims
            </CardDescription>
            {/* Filter Indicator */}
            {statusFilter !== 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  Filtered by: {statusFilter}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => applyTileFilter('all')}>
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {filteredClaims.length > 0 ? (
                <WarrantyClaimList
                  claims={filteredClaims}
                  onSelectClaim={setSelectedClaim}
                  loading={loading}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No warranty claims found</p>
                      <p className="text-sm">
                        {statusFilter !== 'all' 
                          ? `No claims match the "${statusFilter}" filter`
                          : 'Try adjusting your search criteria'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              <WarrantyClaimList
                claims={filteredClaims.filter(c => c.status === 'pending')}
                onSelectClaim={setSelectedClaim}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="approved" className="space-y-4">
              <WarrantyClaimList
                claims={filteredClaims.filter(c => c.status === 'approved')}
                onSelectClaim={setSelectedClaim}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="rejected" className="space-y-4">
              <WarrantyClaimList
                claims={filteredClaims.filter(c => c.status === 'rejected')}
                onSelectClaim={setSelectedClaim}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}