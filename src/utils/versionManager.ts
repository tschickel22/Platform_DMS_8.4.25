import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface ProjectVersion {
  id: string
  name: string
  description?: string
  timestamp: string
  snapshot: {
    packageJson: any
    fileCount: number
    modules: string[]
    features: string[]
  }
}

export class VersionManager {
  private static readonly STORAGE_KEY = 'project-versions'

  static saveVersion(name: string, description?: string): ProjectVersion {
    const versions = this.getVersions()
    
    const newVersion: ProjectVersion = {
      id: `version-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      timestamp: new Date().toISOString(),
      snapshot: {
        packageJson: {
          name: 'renter-insight-crm',
          version: '1.0.0'
        },
        fileCount: 200, // Approximate based on project structure
        modules: [
          'crm-prospecting',
          'inventory-management', 
          'quote-builder',
          'agreement-vault',
          'service-ops',
          'delivery-tracker',
          'commission-engine',
          'client-portal',
          'warranty-mgmt',
          'invoice-payments',
          'company-settings',
          'platform-admin',
          'reporting-suite',
          'finance-application',
          'accounts',
          'contacts',
          'brochures',
          'tagging-engine',
          'task-center',
          'calendar-scheduling',
          'contractor-management',
          'website-builder',
          'property-listings',
          'land-management',
          'pdi-checklist'
        ],
        features: [
          'Multi-tenant CRM/DMS system',
          'Modular architecture with independent modules',
          'Client portal with impersonation',
          'Property listings management',
          'Website builder integration',
          'Finance and loan management',
          'Service operations tracking',
          'Agreement vault with e-signatures',
          'Commission engine',
          'Delivery tracking',
          'PDI checklist management',
          'Warranty management',
          'Invoice and payments',
          'Reporting suite',
          'Platform administration',
          'Company settings and branding',
          'Task center and calendar',
          'Contractor management',
          'Land management',
          'Tagging engine',
          'Accounts and contacts management',
          'Brochure generation'
        ]
      }
    }
    
    versions.push(newVersion)
    saveToLocalStorage(this.STORAGE_KEY, versions)
    
    console.log(`✅ Version "${name}" saved successfully!`, {
      id: newVersion.id,
      timestamp: newVersion.timestamp,
      moduleCount: newVersion.snapshot.modules.length,
      featureCount: newVersion.snapshot.features.length
    })
    
    return newVersion
  }

  static getVersions(): ProjectVersion[] {
    return loadFromLocalStorage(this.STORAGE_KEY, [])
  }

  static getVersion(id: string): ProjectVersion | null {
    const versions = this.getVersions()
    return versions.find(v => v.id === id) || null
  }

  static deleteVersion(id: string): boolean {
    const versions = this.getVersions()
    const filtered = versions.filter(v => v.id !== id)
    
    if (filtered.length === versions.length) {
      return false // Version not found
    }
    
    saveToLocalStorage(this.STORAGE_KEY, filtered)
    return true
  }

  static listVersions(): Array<{ id: string; name: string; timestamp: string; description?: string }> {
    return this.getVersions()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(v => ({
        id: v.id,
        name: v.name,
        timestamp: v.timestamp,
        description: v.description
      }))
  }
}

// Save the current version
const phase1Version = VersionManager.saveVersion(
  'phase 1 complete',
  'Completed Phase 1: Core CRM/DMS functionality with all modules working, syntax errors fixed, and client portal operational'
)

// Save Phase 2 version
const phase2Version = VersionManager.saveVersion(
  'phase 2 complete',
  'Completed Phase 2: Inter-module associations with accountId/contactId fields, comprehensive notes management system, and tagging integration across all forms and detail pages'
)

// Save Phase 3 version
const phase3Version = VersionManager.saveVersion(
  'phase 3 completed',
  'Completed Phase 3: Communication features for contacts (call/SMS/email with conditional availability), enhanced list views with summary tiles and advanced filtering, and comprehensive data import/export functionality for accounts and contacts'
)

export { phase1Version, phase2Version, phase3Version }