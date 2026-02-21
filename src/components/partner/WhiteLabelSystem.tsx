'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building, 
  Upload, 
  Download, 
  Eye, 
  Globe, 
  Palette, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Shield,
  CreditCard,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Copy,
  Link,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { db } from '@/lib/db'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  whiteLabelEnabled: boolean
  customDomain?: string
  commissionRate: number
}

interface PartnerBranding {
  id: string
  partnerId: string
  logoUrl?: string
  faviconUrl?: string
  companyName?: string
  customDomain?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  isCustomBranding: boolean
  brandSettings?: any
  createdAt: string
  updatedAt: string
}

interface WhiteLabelSystemProps {
  partner: Partner
  onBrandingUpdated: () => void
}

export default function WhiteLabelSystem({ partner, onBrandingUpdated }: WhiteLabelSystemProps) {
  const [activeTab, setActiveTab] = useState('branding')
  const [isWhiteLabelEnabled, setIsWhiteLabelEnabled] = useState(partner.whiteLabelEnabled)
  const [branding, setBranding] = useState<PartnerBranding | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [domainStatus, setDomainStatus] = useState<'pending' | 'verified' | 'error'>('pending')

  useEffect(() => {
    loadBranding()
  }, [partner.id])

  const loadBranding = async () => {
    try {
      const brandingData = await db.partnerBranding.findUnique({
        where: { partnerId: partner.id }
      })
      setBranding(brandingData)
    } catch (error) {
      console.error('Error loading branding:', error)
    }
  }

  const handleSaveBranding = async () => {
    try {
      setIsSaving(true)
      
      const brandingData = {
        partnerId: partner.id,
        primaryColor: branding?.primaryColor || '#16a34a',
        secondaryColor: branding?.secondaryColor || '#22c55e',
        accentColor: branding?.accentColor || '#10b981',
        backgroundColor: branding?.backgroundColor || '#ffffff',
        textColor: branding?.textColor || '#1f2937',
        isCustomBranding: branding?.isCustomBranding || false,
        companyName: branding?.companyName || partner.companyName,
        customDomain: branding?.customDomain || '',
        logoUrl: branding?.logoUrl || '',
        faviconUrl: branding?.faviconUrl || ''
      }

      if (branding) {
        await db.partnerBranding.update({
          where: { id: branding.id },
          data: brandingData
        })
      } else {
        await db.partnerBranding.create({
          data: brandingData
        })
      }

      await loadBranding()
      onBrandingUpdated()
    } catch (error) {
      console.error('Error saving branding:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBranding(prev => prev ? { ...prev, logoUrl: reader.result as string } : null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBranding(prev => prev ? { ...prev, faviconUrl: reader.result as string } : null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDomainSetup = async () => {
    try {
      setIsLoading(true)
      
      // Update partner with custom domain
      await db.partner.update({
        where: { id: partner.id },
        data: {
          whiteLabelEnabled: true,
          customDomain: branding?.customDomain || ''
        }
      })

      // Simulate domain verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      setDomainStatus('verified')
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error setting up domain:', error)
      setIsLoading(false)
      setDomainStatus('error')
    }
  }

  const copyReferralLink = () => {
    const link = `https://${branding?.customDomain || 'cannabisos.com'}/partner/${partner.id}`
    navigator.clipboard.writeText(link)
    alert('White-label link copied to clipboard!')
  }

  const getDomainStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getDomainStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (!isWhiteLabelEnabled) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">White-Label Not Enabled</h3>
            <p className="text-gray-600 mb-6">
              Enable white-label to customize your platform with your own branding and domain.
            </p>
            <Button onClick={() => setIsWhiteLabelEnabled(true)} className="bg-green-600 hover:bg-green-700">
              <Building className="h-4 w-4 mr-2" />
              Enable White-Label
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">White-Label System</h2>
          <p className="text-gray-600">Customize your branded platform appearance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-green-100 text-green-800">
            White-Label Active
          </Badge>
          {branding?.customDomain && (
            <Button variant="outline" onClick={copyReferralLink}>
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          )}
        </div>
      </div>

      {/* Domain Status */}
      {branding?.customDomain && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Custom Domain</h3>
                <p className="text-sm text-gray-600">{branding.customDomain}</p>
              </div>
              <div className={`flex items-center space-x-1 ${getDomainStatusColor(domainStatus)}`}>
                {getDomainStatusIcon(domainStatus)}
                <span className="text-sm capitalize">{domainStatus}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Button>
              <Button variant="outline" size="sm" onClick={handleDomainSetup} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Verify Domain
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={branding?.companyName || ''}
                    onChange={(e) => setBranding(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-domain">Custom Domain</Label>
                  <Input
                    id="custom-domain"
                    value={branding?.customDomain || ''}
                    onChange={(e) => setBranding(prev => prev ? { ...prev, customDomain: e.target.value } : null)}
                    placeholder="yourbrand.dispensaryos.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={branding?.primaryColor || '#16a34a'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, primaryColor: e.target.value } : null)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={branding?.primaryColor || '#16a34a'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, primaryColor: e.target.value } : null)}
                        placeholder="#16a34a"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={branding?.secondaryColor || '#22c55e'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, secondaryColor: e.target.value } : null)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={branding?.secondaryColor || '#22c55e'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, secondaryColor: e.target.value } : null)}
                        placeholder="#22c55e"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={branding?.accentColor || '#10b981'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, accentColor: e.target.value } : null)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={branding?.accentColor || '#10b981'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, accentColor: e.target.value } : null)}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="text-color"
                        type="color"
                        value={branding?.textColor || '#1f2937'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, textColor: e.target.value } : null)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={branding?.textColor || '#1f2937'}
                        onChange={(e) => setBranding(prev => prev ? { ...prev, textColor: e.target.value } : null)}
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="background-color"
                      type="color"
                      value={branding?.backgroundColor || '#ffffff'}
                      onChange={(e) => setBranding(prev => prev ? { ...prev, backgroundColor: e.target.value } : null)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={branding?.backgroundColor || '#ffffff'}
                      onChange={(e) => setBranding(prev => prev ? { ...prev, backgroundColor: e.target.value } : null)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo and Favicon */}
            <Card>
              <CardHeader>
                <CardTitle>Logo & Favicon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Company Logo</Label>
                  <div className="flex items-center space-x-4">
                    {branding?.logoUrl ? (
                      <div className="w-20 h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-white">
                        <img src={branding.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or GIF (max 2MB)
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="favicon-upload">Favicon</Label>
                  <div className="flex items-center space-x-4">
                    {branding?.faviconUrl ? (
                      <div className="w-12 h-12 rounded border-2 border-gray-200 flex items-center justify-center bg-white">
                        <img src={branding.faviconUrl} alt="Favicon" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="favicon-upload"
                        type="file"
                        accept="image/x-icon,image/png"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('favicon-upload')?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </Button>
                      <p className="text-xs text-gray-500">
                        ICO or PNG (32x32px recommended)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveBranding} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Branding'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="domain" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Domain Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-domain-input">Custom Domain</Label>
                  <Input
                    id="custom-domain-input"
                    value={branding?.customDomain || ''}
                    onChange={(e) => setBranding(prev => prev ? { ...prev, customDomain: e.target.value } : null)}
                    placeholder="yourbrand.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your custom domain name
                  </p>
                </div>
                <div>
                  <Label>DNS Configuration</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>A Record:</strong> 192.168.1.1</p>
                      <p><strong>CNAME:</strong> dispensaries.cannabisos.com</p>
                      <p><strong>MX Record:</strong> mail.yourbrand.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-y-2">
                  <Button onClick={handleDomainSetup} disabled={isLoading} className="w-full">
                    {isLoading ? 'Verifying...' : 'Verify Domain Setup'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download DNS Instructions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SSL Certificate */}
            <Card>
              <CardHeader>
                <CardTitle>SSL Certificate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">SSL Certificate Active</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Automatic SSL provisioning enabled
                  </p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew Certificate
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Certificate Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Preview Header */}
                <div 
                  className="p-4 border-b"
                  style={{ 
                    backgroundColor: branding?.primaryColor || '#16a34a',
                    color: branding?.textColor || '#ffffff' 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {branding?.logoUrl ? (
                        <img src={branding.logoUrl} alt="Logo" className="h-8 w-8 object-contain bg-white rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <Building className="h-4 w-4" style={{ color: branding?.primaryColor || '#16a34a' }} />
                        </div>
                      )}
                      <span className="font-bold text-lg">{branding?.companyName || partner.companyName}</span>
                    </div>
                    <nav className="flex space-x-6">
                      <span className="text-sm hover:opacity-80 cursor-pointer">Dashboard</span>
                      <span className="text-sm hover:opacity-80 cursor-pointer">Clients</span>
                      <span className="text-sm hover:opacity-80 cursor-pointer">Reports</span>
                      <span className="text-sm hover:opacity-80 cursor-pointer">Settings</span>
                    </nav>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div style={{ backgroundColor: branding?.backgroundColor || '#ffffff', color: branding?.textColor || '#1f2937' }}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Welcome to Your Branded Platform</h3>
                    <p className="mb-6">
                      This is how your platform will appear to your clients with your custom branding.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className="p-4 rounded-lg text-center"
                        style={{ backgroundColor: (branding?.secondaryColor || '#22c55e') + '20', color: branding?.textColor || '#1f2937' }}
                      >
                        <Building className="h-8 w-8 mx-auto mb-2" style={{ color: branding?.primaryColor || '#16a34a' }} />
                        <p className="text-sm font-medium">Your Clients</p>
                      </div>
                      <div 
                        className="p-4 rounded-lg text-center"
                        style={{ backgroundColor: (branding?.secondaryColor || '#22c55e') + '20', color: branding?.textColor || '#1f2937' }}
                      >
                        <FileText className="h-8 w-8 mx-auto mb-2" style={{ color: branding?.primaryColor || '#16a34a' }} />
                        <p className="text-sm font-medium">Reports</p>
                      </div>
                      <div 
                        className="p-4 rounded-lg text-center"
                        style={{ backgroundColor: (branding?.secondaryColor || '#22c55e') + '20', color: branding?.textColor || '#1f2937' }}
                      >
                        <DollarSign className="h-8 w-8 mx-auto mb-2" style={{ color: branding?.primaryColor || '#16a34a' }} />
                        <p className="text-sm font-medium">Revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Custom CSS (Optional)</Label>
                  <textarea
                    placeholder="Enter custom CSS rules..."
                    rows={6}
                    className="font-mono text-xs w-full p-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add custom CSS for advanced styling
                  </p>
                </div>
                <div>
                  <Label>Custom JavaScript (Optional)</Label>
                  <textarea
                    placeholder="Enter custom JavaScript code..."
                    rows={4}
                    className="font-mono text-xs w-full p-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add custom JavaScript for additional functionality
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Export/Import */}
            <Card>
              <CardHeader>
                <CardTitle>Export/Import Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Export Branding Configuration</Label>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
                <div>
                  <Label>Import Branding Configuration</Label>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import from JSON
                  </Button>
                </div>
                <div>
                  <Label>Reset to Default</Label>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700 border-red-300">
                    <Settings className="h-4 w-4 mr-2" />
                    Reset All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
