import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Home, 
  Car, 
  Mail, 
  ExternalLink, 
  Settings,
  Info,
  AlertCircle
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'

interface Partner {
  id: string
  name: string
  description: string
  listingTypes: ('manufactured_home' | 'rv')[]
  isGloballyActive: boolean
  isCompanyActive: boolean
  companyLeadEmail?: string
  exportUrl: string
}

export default function ListingPartnersSettings() {
  const { tenant } = useTenant()
  const [companyId, setCompanyId] = useState(tenant?.id || '')
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: 'mhvillage',
      name: 'MHVillage',
      description: 'Leading manufactured home marketplace',
      listingTypes: ['manufactured_home'],
      isGloballyActive: true,
      isCompanyActive: true,
      companyLeadEmail: 'leads@ourcompany.com',
      exportUrl: 'https://api.listings.com/feed/mhvillage?companyId=company123'
    },
    {
      id: 'rvtrader',
      name: 'RV Trader',
      description: 'Premier RV marketplace platform',
      listingTypes: ['rv'],
      isGloballyActive: true,
      isCompanyActive: false,
      exportUrl: 'https://api.listings.com/feed/rvtrader?companyId=company123'
    },
    {
      id: 'zillow',
      name: 'Zillow',
      description: 'Real estate marketplace integration',
      listingTypes: ['manufactured_home', 'rv'],
      isGloballyActive: false,
      isCompanyActive: false,
      exportUrl: 'https://api.listings.com/feed/zillow?companyId=company123'
    }
  ])

  const handlePartnerToggle = (partnerId: string) => {
    setPartners(prev => prev.map(partner => 
      partner.id === partnerId 
        ? { ...partner, isCompanyActive: !partner.isCompanyActive }
        : partner
    ))
  }

  const handleLeadEmailChange = (partnerId: string, email: string) => {
    setPartners(prev => prev.map(partner => 
      partner.id === partnerId 
        ? { ...partner, companyLeadEmail: email }
        : partner
    ))
  }

  const activePartnersCount = partners.filter(p => p.isCompanyActive).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Listing Partners</h2>
        <p className="text-gray-600">Manage your syndication partners and lead routing</p>
      </div>

      {/* Company ID Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Company Configuration
          </CardTitle>
          <CardDescription>
            Your unique company identifier for syndication feeds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyId">Company ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="companyId"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="your-company-id"
                className="font-mono"
              />
              <Button variant="outline">Update</Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This ID is used in feed URLs and must be unique across the platform
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Partners Status Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{activePartnersCount}</p>
              <p className="text-sm text-gray-600">Active Partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {partners.filter(p => p.isGloballyActive).length}
              </p>
              <p className="text-sm text-gray-600">Available Partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {partners.filter(p => p.companyLeadEmail).length}
              </p>
              <p className="text-sm text-gray-600">Custom Lead Emails</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Partners</h3>
        
        {partners.map((partner) => (
          <Card key={partner.id} className={`${!partner.isGloballyActive ? 'opacity-60' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold">{partner.name}</h4>
                    </div>
                    
                    <div className="flex gap-1">
                      {partner.listingTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type === 'manufactured_home' ? (
                            <>
                              <Home className="h-3 w-3 mr-1" />
                              MH
                            </>
                          ) : (
                            <>
                              <Car className="h-3 w-3 mr-1" />
                              RV
                            </>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {!partner.isGloballyActive && (
                      <Badge variant="outline" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{partner.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">EXPORT URL</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {partner.exportUrl}
                        </code>
                      </div>
                    </div>
                    
                    {partner.isCompanyActive && (
                      <div>
                        <Label htmlFor={`leadEmail-${partner.id}`}>
                          Lead Email Override (optional)
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id={`leadEmail-${partner.id}`}
                              type="email"
                              value={partner.companyLeadEmail || ''}
                              onChange={(e) => handleLeadEmailChange(partner.id, e.target.value)}
                              placeholder="leads@yourcompany.com"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Override the default lead email for this partner
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {partner.isCompanyActive ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={partner.isCompanyActive}
                      onCheckedChange={() => handlePartnerToggle(partner.id)}
                      disabled={!partner.isGloballyActive}
                    />
                  </div>
                  
                  {!partner.isGloballyActive && (
                    <div className="text-xs text-gray-500 text-right">
                      <Info className="h-3 w-3 inline mr-1" />
                      Contact admin to enable
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button size="lg">
          Save Partner Settings
        </Button>
      </div>
    </div>
  )
}