// Shared types and interfaces for Inventory Management

export interface BaseVehicle {
  id: string
  type: 'RV' | 'MH'
  status: 'Available' | 'Reserved' | 'Sold' | 'Pending'
  createdAt: string
  updatedAt: string
}

// RV Vehicle following Google Vehicle Listing structured data
export interface RVVehicle extends BaseVehicle {
  type: 'RV'
  // Required fields from Google Vehicle Listing spec
  vehicleIdentificationNumber: string // VIN
  brand: string // make
  model: string
  modelDate: number // year
  mileage?: number
  bodyStyle?: string // Class A, Class B, Class C, Travel Trailer, etc.
  fuelType?: string
  vehicleTransmission?: string
  color?: string
  price: number
  priceCurrency: string
  availability: string
  images: string[]
  url?: string // listing URL
  description?: string
  // Seller information
  sellerName?: string
  sellerPhone?: string
  sellerEmail?: string
}

// Manufactured Housing with all specified fields
export interface MHVehicle extends BaseVehicle {
  type: 'MH'
  // Seller & Contact
  sellerID?: string // text[11]
  companyID?: string // text[11]
  sellerAccountKey?: number
  sellerFirstName?: string // text[30]
  sellerLastName?: string // text[30]
  sellerCompanyName?: string // text[80]
  sellerPhone?: string // text[10]
  sellerPhone2?: string // text[10]
  sellerEmail?: string
  sellerEmail2?: string
  sellerEmail3?: string
  sellerEmail4?: string
  sellerFax?: string // text[10]
  sellerWebsite?: string
  searchResultsText?: string // text[80]
  
  // Pricing & Status (required: AskingPrice)
  askingPrice: number // required
  rentalPrice?: number
  soldPrice?: number
  taxes?: string // text[20]
  lotRent?: string // text[20]
  packageType?: string // text[10]
  salePending?: 'Yes' | 'No' // text[7]
  repo?: 'Yes' | 'No' // text[7]
  utilities?: string // text[30]
  
  // Location (required: Address1, City, State, Zip9)
  locationType?: string // text[20]
  communityKey?: string
  communityName?: string // text[60]
  address1: string // required, text[80]
  address2?: string // text[80]
  city: string // required, text[60]
  state: string // required, text[2]
  zip9: string // required, text[9]
  countyName?: string // text[60]
  township?: string // text[60]
  schoolDistrict?: string // text[60]
  // Internal fields (not exposed in UI)
  latitude?: number
  longitude?: number
  
  // Home Basics (required: HomeType, Make, Year, Bedrooms, Bathrooms)
  homeType: string // required, text[12]
  make: string // required, text[40]
  model?: string // text[40]
  year: number // required
  color?: string // text[40]
  serialNumber?: string // text[40]
  
  // Dimensions (required: Bedrooms, Bathrooms)
  width1?: number // tinyint[4]
  length1?: number // tinyint[4]
  width2?: number // tinyint[4]
  length2?: number // tinyint[4]
  width3?: number // tinyint[4]
  length3?: number // tinyint[4]
  bedrooms: number // required, tinyint[4]
  bathrooms: number // required, float
  
  // Construction
  roofType?: string // text[10]
  sidingType?: string // text[10]
  ceilingType?: string // text[10]
  wallType?: string // text[10]
  
  // Exterior Yes/No
  garage?: 'Yes' | 'No' // text[7]
  carport?: 'Yes' | 'No' // text[7]
  gutters?: 'Yes' | 'No' // text[7]
  shutters?: 'Yes' | 'No' // text[7]
  deck?: 'Yes' | 'No' // text[7]
  patio?: 'Yes' | 'No' // text[7]
  storageShed?: 'Yes' | 'No' // text[7]
  fireplace?: 'Yes' | 'No' // text[7]
  
  // Climate & Windows
  centralAir?: 'Yes' | 'No' // text[7]
  thermopane?: 'Yes' | 'No' // text[7]
  
  // Interior Yes/No
  cathedralCeiling?: 'Yes' | 'No' // text[7]
  ceilingFan?: 'Yes' | 'No' // text[7]
  skylight?: 'Yes' | 'No' // text[7]
  walkinCloset?: 'Yes' | 'No' // text[7]
  laundryRoom?: 'Yes' | 'No' // text[7]
  pantry?: 'Yes' | 'No' // text[7]
  sunRoom?: 'Yes' | 'No' // text[7]
  basement?: 'Yes' | 'No' // text[7]
  gardenTub?: 'Yes' | 'No' // text[7]
  
  // Appliances Yes/No
  garbageDisposal?: 'Yes' | 'No' // text[7]
  refrigerator?: 'Yes' | 'No' // text[7]
  microwave?: 'Yes' | 'No' // text[7]
  oven?: 'Yes' | 'No' // text[7]
  dishwasher?: 'Yes' | 'No' // text[7]
  clothesWasher?: 'Yes' | 'No' // text[7]
  clothesDryer?: 'Yes' | 'No' // text[7]
  
  // Media
  photoURL?: string
  virtualTour?: string
  salesPhoto?: string
  
  // Descriptions
  description?: string
  terms?: string
  
  // Custom fields
  customFields?: Array<{
    name: string
    type: 'text' | 'number' | 'boolean' | 'date'
    value: string | number | boolean
  }>
}

export type Vehicle = RVVehicle | MHVehicle

// Form data types
export interface RVFormData extends Omit<RVVehicle, 'id' | 'createdAt' | 'updatedAt'> {}
export interface MHFormData extends Omit<MHVehicle, 'id' | 'createdAt' | 'updatedAt'> {}

// CSV import types
export interface CSVRow {
  [key: string]: string
}

export interface CSVMapping {
  csvColumn: string
  vehicleField: string
  confidence: number
}

export interface CSVImportResult {
  vehicles: Vehicle[]
  errors: Array<{
    row: number
    field: string
    message: string
  }>
  willCreate: number
  willUpdate: number
}

// Filter types
export interface InventoryFilters {
  searchTerm: string
  statusFilter: string
  typeFilter: string
}

// Dashboard stats
export interface InventoryStats {
  total: number
  available: number
  reserved: number
  sold: number
  totalValue: number
}