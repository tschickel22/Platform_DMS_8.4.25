import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { WarrantyClaim, ReimbursementRequest, Manufacturer } from '../types';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Upload,
  ExternalLink,
  Clock,
  User,
  Car,
  Wrench
} from 'lucide-react';

interface WarrantyClaimDetailProps {
  claim: WarrantyClaim;
  reimbursementRequests: ReimbursementRequest[];
  manufacturer?: Manufacturer;
  onSubmitForApproval: (claimId: string) => void;
  onApproveReimbursement: (requestId: string) => void;
  onMarkAsPaid: (requestId: string, amount?: number) => void;
  onDenyReimbursement: (requestId: string, reason: string) => void;
  onAddProofDocument: (claimId: string, document: { name: string; url: string; type: string }) => void;
}

export const WarrantyClaimDetail: React.FC<WarrantyClaimDetailProps> = ({
  claim,
  reimbursementRequests,
  manufacturer,
  onSubmitForApproval,
  onApproveReimbursement,
  onMarkAsPaid,
  onDenyReimbursement,
  onAddProofDocument
}) => {
  // Add safety check to prevent accessing properties of undefined claim
  if (!claim) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No warranty claim selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [denialReason, setDenialReason] = useState('');
  const [showDenialForm, setShowDenialForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDenyReimbursement = (requestId: string) => {
    if (denialReason.trim()) {
      onDenyReimbursement(requestId, denialReason);
      setDenialReason('');
      setShowDenialForm(false);
    }
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const mockDocument = {
      name: `proof-${Date.now()}.pdf`,
      url: `/documents/proof-${Date.now()}.pdf`,
      type: 'application/pdf'
    };
    onAddProofDocument(claim.id, mockDocument);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Claim #{claim.claimNumber}
            </CardTitle>
            <Badge className={`${getStatusColor(claim.status)} flex items-center gap-1`}>
              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Car className="w-5 h-5" />
                Vehicle Information
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Vehicle:</span> {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model}
                </div>
                <div>
                  <span className="font-medium">VIN:</span> {claim.vehicleInfo.vin}
                </div>
                <div>
                  <span className="font-medium">Mileage:</span> {claim.vehicleInfo.mileage?.toLocaleString()} miles
                </div>
                <div>
                  <span className="font-medium">Purchase Date:</span> {formatDate(claim.vehicleInfo.purchaseDate)}
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Wrench className="w-5 h-5" />
                Service Information
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Service Item:</span> {claim.serviceItem.name}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {claim.serviceItem.category}
                </div>
                <div>
                  <span className="font-medium">Covered:</span> 
                  {claim.serviceItem.isCovered ? (
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge className="ml-2 bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      No
                    </Badge>
                  )}
                </div>
                <div>
                  <span className="font-medium">Repair Cost:</span> {formatCurrency(claim.repairCost)}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="space-y-2">
            <div className="font-medium">Description:</div>
            <p className="text-gray-700">{claim.description}</p>
          </div>

          {/* Manufacturer Information */}
          {manufacturer && (
            <>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="font-medium">Manufacturer:</div>
                <div className="flex items-center gap-4">
                  <span>{manufacturer.name}</span>
                  {manufacturer.apiIntegration && (
                    <Badge className="bg-blue-100 text-blue-800">API Enabled</Badge>
                  )}
                  {manufacturer.emailCommunication && (
                    <Badge className="bg-green-100 text-green-800">Email Enabled</Badge>
                  )}
                </div>
                {manufacturer.contactEmail && (
                  <div className="text-sm text-gray-600">
                    Contact: {manufacturer.contactEmail}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Approval Threshold Warning */}
          {claim.repairCost > 500 && claim.status === 'draft' && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Manufacturer Approval Required</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                This repair exceeds the $500 threshold and requires manufacturer approval before proceeding.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proof Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Proof Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claim.proofDocuments && claim.proofDocuments.length > 0 ? (
              <div className="space-y-2">
                {claim.proofDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{doc.name}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents uploaded yet</p>
            )}
            
            <Button onClick={handleFileUpload} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {claim.status === 'draft' && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSubmitForApproval(claim.id)}
              className="w-full"
            >
              Submit for Approval
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reimbursement Requests */}
      {reimbursementRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Reimbursement Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reimbursementRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Request #{request.id.slice(-6)}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <span className="font-medium">{formatCurrency(request.amount)}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Submitted:</span> {formatDate(request.submittedAt)}
                    </div>
                    {request.approvedAt && (
                      <div>
                        <span className="font-medium">Approved:</span> {formatDate(request.approvedAt)}
                      </div>
                    )}
                    {request.paidAt && (
                      <div>
                        <span className="font-medium">Paid:</span> {formatDate(request.paidAt)}
                      </div>
                    )}
                    {request.deniedAt && (
                      <div>
                        <span className="font-medium">Denied:</span> {formatDate(request.deniedAt)}
                      </div>
                    )}
                  </div>

                  {request.denialReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <span className="font-medium text-red-800">Denial Reason:</span>
                      <p className="text-red-700 mt-1">{request.denialReason}</p>
                    </div>
                  )}

                  {request.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <span className="font-medium">Notes:</span>
                      <p className="text-gray-700 mt-1">{request.notes}</p>
                    </div>
                  )}

                  {/* Request Actions */}
                  {request.status === 'submitted' && (
                    <div className="flex gap-2 mt-4">
                      <Button 
                        onClick={() => onApproveReimbursement(request.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => setShowDenialForm(!showDenialForm)}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => onMarkAsPaid(request.id)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Mark as Paid
                      </Button>
                    </div>
                  )}

                  {showDenialForm && request.status === 'submitted' && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        placeholder="Enter reason for denial..."
                        value={denialReason}
                        onChange={(e) => setDenialReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleDenyReimbursement(request.id)}
                          size="sm"
                          variant="destructive"
                        >
                          Confirm Denial
                        </Button>
                        <Button 
                          onClick={() => setShowDenialForm(false)}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium">Claim Created</div>
                <div className="text-sm text-gray-500">{formatDate(claim.createdAt)}</div>
              </div>
            </div>
            
            {claim.status !== 'draft' && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Submitted for Approval</div>
                  <div className="text-sm text-gray-500">{formatDate(claim.updatedAt)}</div>
                </div>
              </div>
            )}

            {reimbursementRequests.map((request) => (
              <div key={request.id}>
                {request.approvedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Reimbursement Approved</div>
                      <div className="text-sm text-gray-500">{formatDate(request.approvedAt)}</div>
                    </div>
                  </div>
                )}
                
                {request.paidAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Payment Received</div>
                      <div className="text-sm text-gray-500">{formatDate(request.paidAt)}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};