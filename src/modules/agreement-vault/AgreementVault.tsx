import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { mockAgreements } from '@/mocks/agreementsMock'

export default function AgreementVault() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const agreements = mockAgreements.sampleAgreements || []

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = searchTerm === '' || 
      agreement.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.vehicleInfo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SIGNED':
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'EXPIRED':
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    const statusConfig = mockAgreements.agreementStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }

  const stats = {
    total: agreements.length,
    pending: agreements.filter(a => a.status === 'PENDING').length,
    signed: agreements.filter(a => a.status === 'SIGNED').length,
    active: agreements.filter(a => a.status === 'ACTIVE').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agreement Vault</h1>
          <p className="text-muted-foreground">
            Manage contracts, agreements, and digital signatures
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Agreement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signature</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.signed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agreements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          {mockAgreements.agreementStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No agreements found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first agreement'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Agreement
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAgreements.map((agreement) => (
            <Card key={agreement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(agreement.status)}
                      <h3 className="text-lg font-semibold">
                        {agreement.type.replace('_', ' ')} Agreement
                      </h3>
                      <Badge className={getStatusColor(agreement.status)}>
                        {agreement.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">{agreement.customerName}</p>
                        <p className="text-muted-foreground">{agreement.customerEmail}</p>
                      </div>
                      
                      {agreement.vehicleInfo && (
                        <div>
                          <p className="text-muted-foreground">Vehicle</p>
                          <p className="font-medium">{agreement.vehicleInfo}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {new Date(agreement.createdAt).toLocaleDateString()}
                        </p>
                        {agreement.effectiveDate && (
                          <>
                            <p className="text-muted-foreground mt-1">Effective</p>
                            <p className="font-medium">
                              {new Date(agreement.effectiveDate).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {agreement.totalAmount && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-semibold text-lg">
                            ${agreement.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        {agreement.downPayment && (
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Down Payment:</span>
                            <span>${agreement.downPayment.toLocaleString()}</span>
                          </div>
                        )}
                        {agreement.monthlyPayment && (
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Monthly Payment:</span>
                            <span>${agreement.monthlyPayment.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {agreement.status === 'PENDING' && (
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}