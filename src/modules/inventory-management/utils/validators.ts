import { RVFormData, MHFormData, CSVRow } from '../state/types'

// RV validation
export const validateRVForm = (data: Partial<RVFormData>): string[] => {
  const errors: string[] = []
  
  if (!data.vehicleIdentificationNumber?.trim()) {
    errors.push('VIN is required')
  }
  
  if (!data.brand?.trim()) {
    errors.push('Make/Brand is required')
  }
  
  if (!data.model?.trim()) {
    errors.push('Model is required')
  }
  
  if (!data.modelDate || data.modelDate < 1900 || data.modelDate > new Date().getFullYear() + 1) {
    errors.push('Valid year is required')
  }
  
  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0')
  }
  
  if (!data.priceCurrency?.trim()) {
    errors.push('Price currency is required')
  }
  
  return errors
}

// MH validation
export const validateMHForm = (data: Partial<MHFormData>): string[] => {
  const errors: string[] = []
  
  // Required fields validation
  if (!data.askingPrice || data.askingPrice <= 0) {
    errors.push('Asking Price is required and must be greater than 0')
  }
  
  if (!data.homeType?.trim()) {
    errors.push('Home Type is required')
  }
  
  if (!data.make?.trim()) {
    errors.push('Make is required')
  }
  
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push('Valid year is required')
  }
  
  if (!data.bedrooms || data.bedrooms < 0) {
    errors.push('Number of bedrooms is required')
  }
  
  if (!data.bathrooms || data.bathrooms < 0) {
    errors.push('Number of bathrooms is required')
  }
  
  if (!data.address1?.trim()) {
    errors.push('Address is required')
  }
  
  if (!data.city?.trim()) {
    errors.push('City is required')
  }
  
  if (!data.state?.trim() || data.state.length !== 2) {
    errors.push('Valid 2-letter state code is required')
  }
  
  if (!data.zip9?.trim() || !/^\d{5}(-\d{4})?$/.test(data.zip9)) {
    errors.push('Valid ZIP code is required (12345 or 12345-6789)')
  }
  
  return errors
}

// CSV row validation
export const validateCSVRow = (row: CSVRow, rowIndex: number, vehicleType: 'RV' | 'MH'): Array<{
  row: number
  field: string
  message: string
}> => {
  const errors: Array<{ row: number; field: string; message: string }> = []
  
  if (vehicleType === 'RV') {
    if (!row.vin && !row.VIN && !row.vehicleIdentificationNumber) {
      errors.push({
        row: rowIndex,
        field: 'VIN',
        message: 'VIN is required for RV'
      })
    }
    
    if (!row.make && !row.brand && !row.Make && !row.Brand) {
      errors.push({
        row: rowIndex,
        field: 'Make',
        message: 'Make/Brand is required for RV'
      })
    }
    
    if (!row.price && !row.Price && !row.askingPrice && !row.AskingPrice) {
      errors.push({
        row: rowIndex,
        field: 'Price',
        message: 'Price is required for RV'
      })
    }
  } else if (vehicleType === 'MH') {
    if (!row.askingPrice && !row.AskingPrice && !row.price && !row.Price) {
      errors.push({
        row: rowIndex,
        field: 'AskingPrice',
        message: 'Asking Price is required for MH'
      })
    }
    
    if (!row.homeType && !row.HomeType) {
      errors.push({
        row: rowIndex,
        field: 'HomeType',
        message: 'Home Type is required for MH'
      })
    }
    
    if (!row.make && !row.Make) {
      errors.push({
        row: rowIndex,
        field: 'Make',
        message: 'Make is required for MH'
      })
    }
    
    if (!row.address1 && !row.Address1 && !row.address && !row.Address) {
      errors.push({
        row: rowIndex,
        field: 'Address',
        message: 'Address is required for MH'
      })
    }
  }
  
  return errors
}

// Field length validation
export const validateFieldLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`
  }
  return null
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (10 digits)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}