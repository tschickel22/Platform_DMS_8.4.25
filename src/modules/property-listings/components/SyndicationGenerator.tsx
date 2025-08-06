import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, 
  ExternalLink, 
  Globe, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SyndicationPartner {
  id: string
  name: string
  description: string
  requiresApiKey: boolean
  requiresPartnerId: boolean
  feedFormat: 'xml' | 'json'
  status: 'active' | 'beta' | 'coming-soon'
}

const syndicationPartners: SyndicationPartner[] = [
  {
    id: 'zillow',
    name: 'Zillow',
    description: 'Syndicate your listings to Zillow Rental Manager',
    requiresApiKey: false,
    requiresPartnerId: true,
    feedFormat: 'xml',
    status: 'active'
  },
  {
    id: 'apartments',
    name: 'Apartments.com',
    description: 'List your properties on Apartments.com',
    requiresApiKey: true,
    requiresPartnerId: true,
    feedFormat: 'xml',
    status: 'beta'
  },
  {
    id: 'rentals',
    name: 'Rentals.com',
    description: 'Syndicate to Rentals.com marketplace',
    requiresApiKey: false,
    requiresPartnerId: true,
    feedFormat: 'json',
    status: 'active'
  },
  {
    id: 'rent',
    name: 'Rent.com',
    description: 'Distribute listings to Rent.com',
    requiresApiKey: true,
    requiresPartnerId: false,
    feedFormat: 'xml',
    status: 'coming-soon'
  }
]

export default function SyndicationGenerator() {
  const [selectedPartner, setSelectedPartner] = useState<string>('')
  const [partnerId, setPartnerId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [customParams, setCustomParams] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const selectedPartnerData = syndicationPartners.find(p => p.id === selectedPartner)

  const generateFeedUrl = async () => {
    if (!selectedPartner) {
      toast({
        title: "Partner Required",
        description: "Please select a syndication partner first.",
        variant: "destructive"
      })
      return
    }

    if (selectedPartnerData?.requiresPartnerId && !partnerId) {
      toast({
        title: "Partner ID Required",
        description: "This partner requires a Partner ID to generate the feed URL.",
        variant: "destructive"
      })
      return
    }

    if (selectedPartnerData?.requiresApiKey && !apiKey) {
      toast({
        title: "API Key Required",
        description: "This partner requires an API Key to generate the feed URL.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Construct the syndication feed URL
      const baseUrl = window.location.origin
      const params = new URLSearchParams()
      
      if (partnerId) params.append('partnerId', partnerId)
      if (apiKey) params.append('apiKey', apiKey)
      if (customParams) {
        // Parse custom parameters (expecting key=value format, one per line)
        const customParamLines = customParams.split('\n').filter(line => line.trim())
        customParamLines.forEach(line => {
          const [key, value] = line.split('=').map(s => s.trim())
          if (key && value) {
            params.append(key, value)
          }
        })
      }

      const feedUrl = `${baseUrl}/netlify/functions/${selectedPartner}-syndication?${params.toString()}`
      setGeneratedUrl(feedUrl)

      toast({
        title: "Feed URL Generated",
        description: "Your syndication feed URL has been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate the syndication feed URL. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      toast({
        title: "Copied!",
        description: "Feed URL copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive"
      })
    }
  }

  const testFeedUrl = () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Syndication Generator</h1>
        <p className="text-muted-foreground">
          Generate syndication feed URLs for external listing platforms
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Feed Configuration
              </CardTitle>
              <CardDescription>
                Configure your syndication feed settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Partner Selection */}
              <div className="space-y-2">
                <Label htmlFor="partner">Syndication Partner</Label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a syndication partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {syndicationPartners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{partner.name}</span>
                          <Badge 
                            variant={
                              partner.status === 'active' ? 'default' : 
                              partner.status === 'beta' ? 'secondary' : 'outline'
                            }
                            className="ml-2"
                          >
                            {partner.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Partner Details */}
              {selectedPartnerData && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">{selectedPartnerData.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-xs text-blue-600">
                    <span>Format: {selectedPartnerData.feedFormat.toUpperCase()}</span>
                    {selectedPartnerData.requiresApiKey && <span>• API Key Required</span>}
                    {selectedPartnerData.requiresPartnerId && <span>• Partner ID Required</span>}
                  </div>
                </div>
              )}

              {/* Partner ID */}
              {selectedPartnerData?.requiresPartnerId && (
                <div className="space-y-2">
                  <Label htmlFor="partnerId">
                    Partner ID
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="partnerId"
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    placeholder="Enter your partner ID"
                  />
                </div>
              )}

              {/* API Key */}
              {selectedPartnerData?.requiresApiKey && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">
                    API Key
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                </div>
              )}

              {/* Custom Parameters */}
              <div className="space-y-2">
                <Label htmlFor="customParams">Custom Parameters (Optional)</Label>
                <Textarea
                  id="customParams"
                  value={customParams}
                  onChange={(e) => setCustomParams(e.target.value)}
                  placeholder="Enter custom parameters (one per line, format: key=value)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Add custom parameters in key=value format, one per line
                </p>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateFeedUrl} 
                disabled={isGenerating || !selectedPartner}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Feed URL'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Generated URL */}
          {generatedUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Generated Feed URL
                </CardTitle>
                <CardDescription>
                  Use this URL with your syndication partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <code className="text-sm break-all">{generatedUrl}</code>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button onClick={testFeedUrl} variant="outline" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Test Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Select Partner</p>
                    <p className="text-sm text-muted-foreground">
                      Choose the syndication partner you want to work with
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Configure Settings</p>
                    <p className="text-sm text-muted-foreground">
                      Enter required credentials and parameters
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Generate & Share</p>
                    <p className="text-sm text-muted-foreground">
                      Generate the feed URL and provide it to your partner
                    </p>
                  </div>
                </div>
              </div>

              {selectedPartnerData?.status === 'beta' && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-md">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This partner integration is in beta. Contact support if you encounter issues.
                  </p>
                </div>
              )}

              {selectedPartnerData?.status === 'coming-soon' && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                  <Info className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-700">
                    This partner integration is coming soon. Check back later for updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Available Partners</CardTitle>
              <CardDescription>
                Current syndication partners and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syndicationPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          partner.status === 'active' ? 'default' : 
                          partner.status === 'beta' ? 'secondary' : 'outline'
                        }
                      >
                        {partner.status}
                      </Badge>
                      {partner.status === 'active' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}