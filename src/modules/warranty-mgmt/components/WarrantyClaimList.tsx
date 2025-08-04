import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { WarrantyClaim, Manufacturer } from '../types';
import { Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';

interface WarrantyClaimListProps {
  claims: WarrantyClaim[];
  manufacturers: Manufacturer[];
  onSelectClaim: (claim: WarrantyClaim) => void;
  selectedClaimId?: string;
}

const getStatusColor = (status: WarrantyClaim['status']) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'denied': return 'bg-red-100 text-red-800';
    case 'paid': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: WarrantyClaim['status']) => {
  switch (status) {
    case 'draft': return <FileText className="w-4 h-4" />;
    case 'submitted': return <Calendar className="w-4 h-4" />;
    case 'approved': return <DollarSign className="w-4 h-4" />;
    case 'denied': return <AlertCircle className="w-4 h-4" />;
    case 'paid': return <DollarSign className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

export const WarrantyClaimList: React.FC<WarrantyClaimListProps> = ({
  claims,
  manufacturers,
  onSelectClaim,
  selectedClaimId
}) => {
  const getManufacturerName = (manufacturerId: string) => {
    const manufacturer = manufacturers?.find(m => m.id === manufacturerId);
    return manufacturer?.name || 'Unknown';
  };

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    if (!date) {
      return 'N/A';
    }
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(date));
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const safeGetManufacturerName = (manufacturerId: string) => {
    if (!manufacturerId) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Warranty Claims ({claims.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim #</TableHead>
                <TableHead>Vehicle/Item</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow 
                  key={claim.id}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedClaimId === claim.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onSelectClaim(claim)}
                >
                  <TableCell className="font-medium">
                    {claim.claimNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {claim.vehicleInfo?.year} {claim.vehicleInfo?.make} {claim.vehicleInfo?.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        VIN: {claim.vehicleInfo?.vin?.slice(-8)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{claim.serviceItem?.name}</div>
                      <div className="text-sm text-gray-500">{claim.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getManufacturerName(claim?.manufacturerId)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatCurrency(claim?.repairCost)}</div>
                    {(claim?.repairCost || 0) > 500 && (
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Requires approval
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(claim?.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(claim?.status)}
                      {claim?.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(claim?.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClaim(claim);
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {claims.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No warranty claims found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};