import { 
  Manufacturer, 
  WarrantyServiceItem, 
  WarrantyClaim, 
  ReimbursementRequest, 
  WarrantyMetrics,
  VehicleWarrantyInfo,
  WarrantyAttachment,
  WarrantyCommunication
} from '../modules/warranty-mgmt/types';

// Mock Manufacturers
export const mockManufacturers: Manufacturer[] = [
  {
    id: 'mfg-1',
    name: 'Clayton Homes',
    contactEmail: 'warranty@claytonhomes.com',
    apiEndpoint: 'https://api.claytonhomes.com/warranty',
    apiKey: 'clayton_api_key_123',
    communicationMethod: 'both',
    approvalThreshold: 500,
    averageResponseTime: 24,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'mfg-2',
    name: 'Fleetwood RV',
    contactEmail: 'service@fleetwoodrv.com',
    communicationMethod: 'email',
    approvalThreshold: 750,
    averageResponseTime: 48,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'mfg-3',
    name: 'Forest River',
    contactEmail: 'warranty@forestriverinc.com',
    communicationMethod: 'email',
    approvalThreshold: 600,
    averageResponseTime: 36,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Mock Vehicle Warranty Info
export const mockVehicleWarranties: VehicleWarrantyInfo[] = [
  {
    vehicleId: 'veh-1',
    vin: '1HGBH41JXMN109186',
    manufacturerId: 'mfg-1',
    manufacturerName: 'Clayton Homes',
    warrantyStartDate: '2023-06-15',
    warrantyEndDate: '2025-06-15',
    coverageType: 'Structural & Appliances',
    isActive: true,
    transferable: true,
    originalOwner: 'John Smith',
    currentOwner: 'John Smith',
    registrationNumber: 'CLT-2023-001',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z'
  },
  {
    vehicleId: 'veh-2',
    vin: '2HGBH41JXMN109187',
    manufacturerId: 'mfg-2',
    manufacturerName: 'Fleetwood RV',
    warrantyStartDate: '2023-08-20',
    warrantyEndDate: '2025-08-20',
    coverageType: 'Full Coverage',
    isActive: true,
    mileageLimit: 50000,
    currentMileage: 12500,
    transferable: true,
    originalOwner: 'Sarah Johnson',
    currentOwner: 'Mike Davis',
    registrationNumber: 'FLT-2023-045',
    createdAt: '2023-08-20T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z'
  }
];

// Mock Service Items
export const mockWarrantyServiceItems: WarrantyServiceItem[] = [
  {
    id: 'si-1',
    vehicleId: 'veh-1',
    vehicleVin: '1HGBH41JXMN109186',
    serviceTicketId: 'st-001',
    description: 'Hot water heater not heating properly, requires replacement',
    component: 'Hot Water Heater',
    laborHours: 3,
    laborRate: 85,
    partsTotal: 450,
    totalCost: 705,
    isCovered: true,
    manufacturerId: 'mfg-1',
    warrantyExpirationDate: '2025-06-15',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'si-2',
    vehicleId: 'veh-2',
    vehicleVin: '2HGBH41JXMN109187',
    serviceTicketId: 'st-002',
    description: 'Air conditioning unit compressor failure',
    component: 'Air Conditioner',
    laborHours: 4,
    laborRate: 85,
    partsTotal: 850,
    totalCost: 1190,
    isCovered: null, // Pending determination
    manufacturerId: 'mfg-2',
    warrantyExpirationDate: '2025-08-20',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  },
  {
    id: 'si-3',
    vehicleId: 'veh-1',
    vehicleVin: '1HGBH41JXMN109186',
    serviceTicketId: 'st-003',
    description: 'Plumbing leak in kitchen sink area',
    component: 'Plumbing',
    laborHours: 2,
    laborRate: 85,
    partsTotal: 125,
    totalCost: 295,
    isCovered: false, // Not covered - wear and tear
    manufacturerId: 'mfg-1',
    warrantyExpirationDate: '2025-06-15',
    createdAt: '2024-01-25T11:45:00Z',
    updatedAt: '2024-01-25T11:45:00Z'
  }
];

export const mockServiceItems = [
  {
    id: '1',
    name: 'Oil Change Service',
    category: 'Maintenance',
    laborHours: 0.5,
    partsCost: 25.00,
    laborRate: 85.00
  },
  {
    id: '2',
    name: 'Brake Pad Replacement',
    category: 'Repair',
    laborHours: 2.0,
    partsCost: 150.00,
    laborRate: 85.00
  },
  {
    id: '3',
    name: 'Transmission Service',
    category: 'Maintenance',
    laborHours: 1.5,
    partsCost: 75.00,
    laborRate: 85.00
  }
];

// Mock Warranty Claims
export const mockWarrantyClaims: WarrantyClaim[] = [
  {
    id: 'wc-1',
    claimNumber: 'CLT-2024-001',
    serviceItemId: 'si-1',
    vehicleId: 'veh-1',
    vehicleVin: '1HGBH41JXMN109186',
    manufacturerId: 'mfg-1',
    status: 'approved',
    submittedAt: '2024-01-20T10:00:00Z',
    approvedAt: '2024-01-21T14:30:00Z',
    reimbursementAmount: 705,
    submittedBy: 'user-1',
    approvedBy: 'Clayton Warranty Dept',
    notes: 'Hot water heater replacement approved. Standard warranty coverage.',
    attachments: [],
    communicationLog: [],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T14:30:00Z'
  },
  {
    id: 'wc-2',
    claimNumber: 'FLT-2024-002',
    serviceItemId: 'si-2',
    vehicleId: 'veh-2',
    vehicleVin: '2HGBH41JXMN109187',
    manufacturerId: 'mfg-2',
    status: 'pending_approval',
    submittedAt: '2024-01-22T15:00:00Z',
    submittedBy: 'user-2',
    notes: 'AC compressor failure - requesting approval for replacement. Unit is 6 months old.',
    attachments: [],
    communicationLog: [],
    createdAt: '2024-01-22T15:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z'
  }
];

// Mock Reimbursement Requests
export const mockReimbursementRequests: ReimbursementRequest[] = [
  {
    id: 'rr-1',
    claimId: 'wc-1',
    requestNumber: 'RR-2024-001',
    manufacturerId: 'mfg-1',
    requestedAmount: 705,
    approvedAmount: 705,
    status: 'paid',
    submittedAt: '2024-01-22T09:00:00Z',
    processedAt: '2024-01-25T16:00:00Z',
    paidAt: '2024-01-28T10:30:00Z',
    paymentMethod: 'ACH Transfer',
    paymentReference: 'ACH-CLT-240128-001',
    notes: 'Payment processed successfully',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-28T10:30:00Z'
  }
];

// Mock Warranty Metrics
export const mockWarrantyMetrics: WarrantyMetrics = {
  totalClaims: 15,
  pendingApproval: 3,
  approvedClaims: 10,
  deniedClaims: 2,
  totalReimbursementRequested: 12450,
  totalReimbursementReceived: 8920,
  averageProcessingTime: 3.2,
  topManufacturers: [
    {
      manufacturerId: 'mfg-1',
      manufacturerName: 'Clayton Homes',
      claimCount: 8,
      reimbursementTotal: 5640
    },
    {
      manufacturerId: 'mfg-2',
      manufacturerName: 'Fleetwood RV',
      claimCount: 5,
      reimbursementTotal: 2850
    },
    {
      manufacturerId: 'mfg-3',
      manufacturerName: 'Forest River',
      claimCount: 2,
      reimbursementTotal: 430
    }
  ],
  monthlyTrends: [
    { month: '2024-01', claimsSubmitted: 5, reimbursementReceived: 2840 },
    { month: '2023-12', claimsSubmitted: 3, reimbursementReceived: 1950 },
    { month: '2023-11', claimsSubmitted: 4, reimbursementReceived: 2130 },
    { month: '2023-10', claimsSubmitted: 3, reimbursementReceived: 2000 }
  ]
};

// Export all mock data
export const warrantyMockData = {
  manufacturers: mockManufacturers,
  vehicleWarranties: mockVehicleWarranties,
  serviceItems: mockWarrantyServiceItems,
  claims: mockWarrantyClaims,
  reimbursementRequests: mockReimbursementRequests,
  metrics: mockWarrantyMetrics
};