import { RVVehicle, MHVehicle } from '../state/types'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateCSVRow(row: any, vehicleType: 'RV' | 'MH'): ValidationResult {
  const errors: string[] = []

  if (vehicleType === 'RV') {
    // RV validation
    if (!row.vin || typeof row.vin !== 'string' || row.vin.trim().length === 0) {
      errors.push('VIN is required')
    }
    if (!row.make || typeof row.make !== 'string' || row.make.trim().length === 0) {
      errors.push('Make is required')
    }
    if (!row.model || typeof row.model !== 'string' || row.model.trim().length === 0) {
      errors.push('Model is required')
    }
    if (!row.year || isNaN(Number(row.year)) || Number(row.year) < 1900 || Number(row.year) > new Date().getFullYear() + 1) {
      errors.push('Valid year is required')
    }
    if (row.price && (isNaN(Number(row.price)) || Number(row.price) < 0)) {
      errors.push('Price must be a valid positive number')
    }
  } else {
    // MH validation
    if (!row.askingPrice || isNaN(Number(row.askingPrice)) || Number(row.askingPrice) <= 0) {
      errors.push('Asking Price is required and must be greater than 0')
    }
    if (!row.homeType || typeof row.homeType !== 'string' || row.homeType.trim().length === 0) {
      errors.push('Home Type is required')
    }
    if (!row.make || typeof row.make !== 'string' || row.make.trim().length === 0) {
      errors.push('Make is required')
    }
    if (!row.year || isNaN(Number(row.year)) || Number(row.year) < 1900 || Number(row.year) > new Date().getFullYear() + 1) {
      errors.push('Valid year is required')
    }
    if (!row.bedrooms || isNaN(Number(row.bedrooms)) || Number(row.bedrooms) < 0) {
      errors.push('Bedrooms must be a valid number')
    }
    if (!row.bathrooms || isNaN(Number(row.bathrooms)) || Number(row.bathrooms) < 0) {
      errors.push('Bathrooms must be a valid number')
    }
    if (!row.address1 || typeof row.address1 !== 'string' || row.address1.trim().length === 0) {
      errors.push('Address is required')
    }
    if (!row.city || typeof row.city !== 'string' || row.city.trim().length === 0) {
      errors.push('City is required')
    }
    if (!row.state || typeof row.state !== 'string' || row.state.trim().length === 0) {
      errors.push('State is required')
    }
    if (!row.zip9 || typeof row.zip9 !== 'string' || row.zip9.trim().length === 0) {
      errors.push('ZIP code is required')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateRVForRequiredFields(formData: Partial<RVVehicle>): ValidationError[] {
  const errors: ValidationError[] = []

  // Required fields for RV based on Google Vehicle Listing standards
  if (!formData.vin?.trim()) {
    errors.push({ field: 'vin', message: 'VIN is required' })
  }

  if (!formData.make?.trim()) {
    errors.push({ field: 'make', message: 'Make is required' })
  }

  if (!formData.model?.trim()) {
    errors.push({ field: 'model', message: 'Model is required' })
  }

  if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
    errors.push({ field: 'year', message: 'Valid year is required' })
  }

  if (!formData.price || formData.price <= 0) {
    errors.push({ field: 'price', message: 'Valid price is required' })
  }

  if (!formData.bodyStyle?.trim()) {
    errors.push({ field: 'bodyStyle', message: 'Body style is required' })
  }

  if (!formData.fuelType?.trim()) {
    errors.push({ field: 'fuelType', message: 'Fuel type is required' })
  }

  if (!formData.transmission?.trim()) {
    errors.push({ field: 'transmission', message: 'Transmission is required' })
  }

  if (!formData.availability?.trim()) {
    errors.push({ field: 'availability', message: 'Availability status is required' })
  }

  return errors
}

export function validateMHForRequiredFields(formData: Partial<MHVehicle>): ValidationError[] {
  const errors: ValidationError[] = []

  // Required fields for MH based on the specification
  if (!formData.askingPrice || formData.askingPrice <= 0) {
    errors.push({ field: 'askingPrice', message: 'Valid asking price is required' })
  }

  if (!formData.homeType?.trim()) {
    errors.push({ field: 'homeType', message: 'Home type is required' })
  }

  if (!formData.make?.trim()) {
    errors.push({ field: 'make', message: 'Make is required' })
  }

  if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
    errors.push({ field: 'year', message: 'Valid year is required' })
  }

  if (!formData.bedrooms || formData.bedrooms < 0) {
    errors.push({ field: 'bedrooms', message: 'Number of bedrooms is required' })
  }

  if (!formData.bathrooms || formData.bathrooms < 0) {
    errors.push({ field: 'bathrooms', message: 'Number of bathrooms is required' })
  }

  if (!formData.address1?.trim()) {
    errors.push({ field: 'address1', message: 'Address is required' })
  }

  if (!formData.city?.trim()) {
    errors.push({ field: 'city', message: 'City is required' })
  }

  if (!formData.state?.trim()) {
    errors.push({ field: 'state', message: 'State is required' })
  }

  if (!formData.zip9?.trim()) {
    errors.push({ field: 'zip9', message: 'ZIP code is required' })
  }

  return errors
}

// Additional validation helpers
export function validateVIN(vin: string): boolean {
  // Basic VIN validation - 17 characters, alphanumeric except I, O, Q
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/
  return vinRegex.test(vin)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)\.]/g, ''))
}

export function validateZipCode(zip: string): boolean {
  // US ZIP code validation (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}