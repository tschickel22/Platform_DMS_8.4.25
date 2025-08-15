import { RVVehicle } from '../state/types'

// Generate JSON-LD structured data for Google Vehicle Listing
export const generateVehicleListingJsonLD = (rv: RVVehicle): object => {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "vehicleIdentificationNumber": rv.vehicleIdentificationNumber,
    "brand": {
      "@type": "Brand",
      "name": rv.brand
    },
    "model": rv.model,
    "modelDate": rv.modelDate?.toString(),
    "vehicleModelDate": rv.modelDate?.toString(),
    "mileageFromOdometer": rv.mileage ? {
      "@type": "QuantitativeValue",
      "value": rv.mileage,
      "unitCode": "SMI"
    } : undefined,
    "bodyType": rv.bodyStyle,
    "fuelType": rv.fuelType,
    "vehicleTransmission": rv.vehicleTransmission,
    "color": rv.color,
    "offers": {
      "@type": "Offer",
      "price": rv.price,
      "priceCurrency": rv.priceCurrency || "USD",
      "availability": mapAvailabilityToSchema(rv.availability || rv.status),
      "seller": rv.sellerName ? {
        "@type": "Organization",
        "name": rv.sellerName,
        "telephone": rv.sellerPhone,
        "email": rv.sellerEmail
      } : undefined
    },
    "image": rv.images && rv.images.length > 0 ? rv.images : undefined,
    "url": rv.url,
    "description": rv.description,
    "vehicleConfiguration": "RV"
  }
  
  // Remove undefined properties
  return JSON.parse(JSON.stringify(jsonLD))
}

// Map internal availability status to Schema.org availability
const mapAvailabilityToSchema = (status: string): string => {
  switch (status) {
    case 'Available':
      return 'https://schema.org/InStock'
    case 'Reserved':
      return 'https://schema.org/PreOrder'
    case 'Sold':
      return 'https://schema.org/OutOfStock'
    case 'Pending':
      return 'https://schema.org/PreOrder'
    default:
      return 'https://schema.org/InStock'
  }
}

// Generate complete HTML script tag for embedding
export const generateVehicleListingScript = (rv: RVVehicle): string => {
  const jsonLD = generateVehicleListingJsonLD(rv)
  return `<script type="application/ld+json">${JSON.stringify(jsonLD, null, 2)}</script>`
}

// Validate required fields for SEO
export const validateSEORequiredFields = (rv: RVVehicle): string[] => {
  const errors: string[] = []
  
  if (!rv.vehicleIdentificationNumber) {
    errors.push('VIN is required for SEO structured data')
  }
  
  if (!rv.brand) {
    errors.push('Brand/Make is required for SEO structured data')
  }
  
  if (!rv.model) {
    errors.push('Model is required for SEO structured data')
  }
  
  if (!rv.modelDate) {
    errors.push('Model year is required for SEO structured data')
  }
  
  if (!rv.price || rv.price <= 0) {
    errors.push('Price is required for SEO structured data')
  }
  
  if (!rv.priceCurrency) {
    errors.push('Price currency is required for SEO structured data')
  }
  
  return errors
}

// Generate SEO-friendly title and description
export const generateSEOMetadata = (rv: RVVehicle): {
  title: string
  description: string
  keywords: string[]
} => {
  const title = `${rv.modelDate} ${rv.brand} ${rv.model}${rv.bodyStyle ? ` ${rv.bodyStyle}` : ''} - $${rv.price?.toLocaleString()}`
  
  const description = rv.description || 
    `${rv.modelDate} ${rv.brand} ${rv.model}${rv.bodyStyle ? ` ${rv.bodyStyle}` : ''} for sale. ` +
    `${rv.mileage ? `${rv.mileage.toLocaleString()} miles. ` : ''}` +
    `Priced at $${rv.price?.toLocaleString()}. ` +
    `${rv.fuelType ? `${rv.fuelType} engine. ` : ''}` +
    `${rv.vehicleTransmission ? `${rv.vehicleTransmission} transmission. ` : ''}` +
    `Contact ${rv.sellerName || 'seller'} for more information.`
  
  const keywords = [
    rv.brand,
    rv.model,
    rv.modelDate?.toString(),
    rv.bodyStyle,
    'RV',
    'recreational vehicle',
    'for sale',
    rv.fuelType,
    rv.vehicleTransmission
  ].filter(Boolean) as string[]
  
  return {
    title: title.substring(0, 60), // SEO title length limit
    description: description.substring(0, 160), // SEO description length limit
    keywords
  }
}