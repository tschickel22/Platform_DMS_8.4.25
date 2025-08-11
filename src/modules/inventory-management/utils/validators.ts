import { RVVehicle, MHVehicle } from '../state/types'

export interface ValidationError {
  field: string
  message: string
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