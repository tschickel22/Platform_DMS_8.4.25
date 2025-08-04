// Warranty Service & Reimbursement Tracking Types

export interface Manufacturer {
  id: string;
  name: string;
  contactEmail?: string;
  apiEndpoint?: string;
  apiKey?: string;
  communicationMethod: 'email' | 'api' | 'both';
  approvalThreshold: number;
  averageResponseTime: number; // in hours
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyServiceItem {
  id: string;
  vehicleId: string;
  vehicleVin: string;
  serviceTicketId: string;
  description: string;
  component: string; // e.g., "Hot Water Heater", "Air Conditioner"
  laborHours: number;
  laborRate: number;
  partsTotal: number;
  totalCost: number;
  isCovered: boolean | null; // null = unknown, true = covered, false = not covered
  manufacturerId?: string;
  warrantyExpirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyClaim {
  id: string;
  claimNumber: string;
  serviceItemId: string;
  vehicleId: string;
  vehicleVin: string;
  manufacturerId: string;
  status: WarrantyClaimStatus;
  submittedAt?: string;
  approvedAt?: string;
  deniedAt?: string;
  denialReason?: string;
  reimbursementAmount?: number;
  submittedBy: string; // user ID
  approvedBy?: string; // manufacturer contact
  notes: string;
  attachments: WarrantyAttachment[];
  communicationLog: WarrantyCommunication[];
  createdAt: string;
  updatedAt: string;
}

export type WarrantyClaimStatus = 
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'denied'
  | 'submitted_for_reimbursement'
  | 'reimbursement_approved'
  | 'reimbursement_denied'
  | 'paid'
  | 'closed';

export interface WarrantyAttachment {
  id: string;
  claimId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface WarrantyCommunication {
  id: string;
  claimId: string;
  type: 'email' | 'api' | 'phone' | 'note';
  direction: 'inbound' | 'outbound';
  subject?: string;
  message: string;
  fromEmail?: string;
  toEmail?: string;
  sentBy?: string;
  receivedAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  laborHours: number;
  partsCost: number;
  laborRate: number;
}

export interface ReimbursementRequest {
  id: string;
  claimId: string;
  requestNumber: string;
  manufacturerId: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: ReimbursementStatus;
  submittedAt: string;
  processedAt?: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReimbursementStatus = 
  | 'pending'
  | 'approved'
  | 'denied'
  | 'paid'
  | 'cancelled';

export interface WarrantySettings {
  coverageTrackingEnabled: boolean;
  manufacturerApprovalRequiredThreshold: number;
  allowUnapprovedRepairs: boolean;
  submitForReimbursement: boolean;
  manufacturerSettings: {
    allowEmailCommunication: boolean;
    allowApiIntegration: boolean;
    defaultManufacturers: string[];
    customManufacturersPerCompany: boolean;
  };
  reimbursementTracking: {
    enableStatusTracking: boolean;
    autoMarkPaid: boolean;
  };
  serviceItemChecks: {
    showCoveredStatus: boolean;
    requireProofForSubmission: boolean;
  };
  notifications: {
    notifyDealerOnApproval: boolean;
    notifyManufacturerOnSubmission: boolean;
    notifyCompanyAdminIfOverdue: boolean;
  };
}

export interface WarrantyMetrics {
  totalClaims: number;
  pendingApproval: number;
  approvedClaims: number;
  deniedClaims: number;
  totalReimbursementRequested: number;
  totalReimbursementReceived: number;
  averageProcessingTime: number; // in days
  topManufacturers: Array<{
    manufacturerId: string;
    manufacturerName: string;
    claimCount: number;
    reimbursementTotal: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    claimsSubmitted: number;
    reimbursementReceived: number;
  }>;
}

export interface VehicleWarrantyInfo {
  vehicleId: string;
  vin: string;
  manufacturerId: string;
  manufacturerName: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  coverageType: string; // e.g., "Structural", "Appliances", "Plumbing"
  isActive: boolean;
  mileageLimit?: number;
  currentMileage?: number;
  transferable: boolean;
  originalOwner: string;
  currentOwner?: string;
  registrationNumber?: string;
  createdAt: string;
  updatedAt: string;
}