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
  Image as ImageIcon
} from 'lucide-react'

interface Consultant {
  id: string
  businessName: string
  contactEmail: string
  whiteLabelEnabled: boolean
  customDomain?: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
}

interface WhiteLabelSettingsProps {
  consultant: Consultant
}

export default function WhiteLabelSettings({ consultant }: WhiteLabelSettingsProps) {
  const [isWhiteLabelEnabled, setIsWhiteLabelEnabled] = useState(consultant.whiteLabelEnabled)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('branding')
  
  const [branding, setBranding] = useState({
    companyName: consultant.businessName,
    customDomain: consultant.customDomain || '',
    logoUrl: consultant.logoUrl || '',
    primaryColor: consultant.primaryColor,
    secondaryColor: consultant.secondaryColor,
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    faviconUrl: ''
  })

  const [domainSettings, setDomainSettings] = useState({
    customDomain: consultant.customDomain || '',
    subdomain: '',
    sslEnabled: true,
    dnsStatus: 'pending' as 'pending' | 'verified' | 'error'
  })

  const handleSaveBranding = async () => {
    try {
      setIsLoading(true)
      
      // In real implementation, this would save to database
      console.log('Saving branding settings:', branding)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsLoading(false)
      // Show success message
      alert('Branding settings saved successfully!')
    } catch (error) {
      console.error('Error saving branding:', error)
      setIsLoading(false)
      alert('Error saving branding settings')
    }
  }

  const handleDomainSetup = async () => {
    try {
      setIsLoading(true)
      
      // In real implementation, this would set up the custom domain
      console.log('Setting up domain:', domainSettings)
      
      // Simulate domain setup
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setDomainSettings({
        ...domainSettings,
        dnsStatus: 'verified'
      })
      
      setIsLoading(false)
      alert('Custom domain setup completed!')
    } catch (error) {
      console.error('Error setting up domain:', error)
      setIsLoading(false)
      alert('Error setting up custom domain')
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In real implementation, this would upload the file
      const reader = new FileReader()
      reader.onloadend = () => {
        setBranding({
          ...branding,
          logoUrl: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In real implementation, this would upload the favicon
      const reader = new FileReader()
      reader.onloadend = () => {
        setBranding({
          ...branding,
          faviconUrl: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
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
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">White-Label Settings</h2>
          <p className="text-gray-600">Customize your branded platform appearance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isWhiteLabelEnabled ? 'default' : 'secondary'}>
            {isWhiteLabelEnabled ? 'White-Label Active' : 'White-Label Disabled'}
          </Badge>
          <div className="flex items-center space-x-2">
            <Label htmlFor="white-label-toggle">Enable White-Label</Label>
            <Switch
              id="white-label-toggle"
              checked={isWhiteLabelEnabled}
              onCheckedChange={setIsWhiteLabelEnabled}
            />
          </div>
        </div>
      </div>

      {!isWhiteLabelEnabled ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">White-Label Disabled</h3>
            <p className="text-gray-600 mb-6">
              Enable white-label to customize your platform with your own branding, domain, and appearance.
            </p>
            <Button onClick={() => setIsWhiteLabelEnabled(true)}>
              Enable White-Label
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="domain">Custom Domain</TabsTrigger>
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
                      value={branding.companyName}
                      onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-domain">Custom Domain</Label>
                    <Input
                      id="custom-domain"
                      value={branding.customDomain}
                      onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
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
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
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
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
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
                          value={branding.accentColor}
                          onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={branding.accentColor}
                          onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
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
                          value={branding.textColor}
                          onChange={(e) => setBranding({ ...branding, textColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={branding.textColor}
                          onChange={(e) => setBranding({ ...branding, textColor: e.target.value })}
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
                        value={branding.backgroundColor}
                        onChange={(e) => setBranding({ ...branding, backgroundColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={branding.backgroundColor}
                        onChange={(e) => setBranding({ ...branding, backgroundColor: e.target.value })}
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
                      {branding.logoUrl ? (
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
                      {branding.faviconUrl ? (
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
              <Button onClick={handleSaveBranding} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Branding Settings'}
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
                      value={domainSettings.customDomain}
                      onChange={(e) => setDomainSettings({ ...domainSettings, customDomain: e.target.value })}
                      placeholder="yourbrand.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your custom domain name
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="subdomain">Subdomain (Optional)</Label>
                    <Input
                      id="subdomain"
                      value={domainSettings.subdomain}
                      onChange={(e) => setDomainSettings({ ...domainSettings, subdomain: e.target.value })}
                      placeholder="portal"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will create: portal.yourbrand.com
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ssl-enabled"
                      checked={domainSettings.sslEnabled}
                      onCheckedChange={(checked) => setDomainSettings({ ...domainSettings, sslEnabled: checked })}
                    />
                    <Label htmlFor="ssl-enabled">Enable SSL Certificate</Label>
                  </div>
                </CardContent>
              </Card>

              {/* DNS Status */}
              <Card>
                <CardHeader>
                  <CardTitle>DNS Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">DNS Status</span>
                      <div className={`flex items-center space-x-1 ${getDomainStatusColor(domainSettings.dnsStatus)}`}>
                        {getDomainStatusIcon(domainSettings.dnsStatus)}
                        <span className="text-sm capitalize">{domainSettings.dnsStatus}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>A Record:</strong> 192.168.1.1</p>
                      <p><strong>CNAME:</strong> dispensaries.cannabisos.com</p>
                      <p><strong>MX Record:</strong> mail.yourbrand.com</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button onClick={handleDomainSetup} disabled={isLoading} className="w-full">
                      {isLoading ? 'Setting up...' : 'Verify Domain Setup'}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download DNS Instructions
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
                      backgroundColor: branding.primaryColor,
                      color: branding.textColor 
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {branding.logoUrl ? (
                          <img src={branding.logoUrl} alt="Logo" className="h-8 w-8 object-contain bg-white rounded" />
                        ) : (
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <Building className="h-4 w-4" style={{ color: branding.primaryColor }} />
                          </div>
                        )}
                        <span className="font-bold text-lg">{branding.companyName}</span>
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
                  <div style={{ backgroundColor: branding.backgroundColor, color: branding.textColor }}>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4">Welcome to Your Branded Platform</h3>
                      <p className="mb-6">
                        This is how your platform will appear to your clients with your custom branding.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div 
                          className="p-4 rounded-lg text-center"
                          style={{ backgroundColor: branding.secondaryColor + '20', color: branding.textColor }}
                        >
                          <Building className="h-8 w-8 mx-auto mb-2" style={{ color: branding.primaryColor }} />
                          <p className="text-sm font-medium">Your Clients</p>
                        </div>
                        <div 
                          className="p-4 rounded-lg text-center"
                          style={{ backgroundColor: branding.secondaryColor + '20', color: branding.textColor }}
                        >
                          <FileText className="h-8 w-8 mx-auto mb-2" style={{ color: branding.primaryColor }} />
                          <p className="text-sm font-medium">Reports</p>
                        </div>
                        <div 
                          className="p-4 rounded-lg text-center"
                          style={{ backgroundColor: branding.secondaryColor + '20', color: branding.textColor }}
                        >
                          <DollarSign className="h-8 w-8 mx-auto mb-2" style={{ color: branding.primaryColor }} />
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
                    <Textarea
                      placeholder="Enter custom CSS rules..."
                      rows={6}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add custom CSS for advanced styling
                    </p>
                  </div>
                  <div>
                    <Label>Custom JavaScript (Optional)</Label>
                    <Textarea
                      placeholder="Enter custom JavaScript code..."
                      rows={4}
                      className="font-mono text-xs"
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
      )}
    </div>
  )
}
