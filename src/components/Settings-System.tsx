'use client'

import { useState, useEffect } from 'react'
import { Settings, User, Store, Bell, Shield, Database, Palette, Globe, Smartphone, Mail, Key, Save, RefreshCw, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserSettings {
  profile: {
    name: string
    email: string
    phone: string
    avatar: string
    bio: string
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    orderUpdates: boolean
    lowStock: boolean
    compliance: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    dateFormat: string
    currency: string
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
    passwordStrength: 'low' | 'medium' | 'high'
    loginAlerts: boolean
  }
}

interface StoreSettings {
  general: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    province: string
    postalCode: string
    country: string
    licenseNumber: string
    timezone: string
    currency: string
  }
  operations: {
    autoAgeVerification: boolean
    requireIdVerification: boolean
    allowOnlineOrders: boolean
    allowDelivery: boolean
    inventoryAlerts: boolean
    lowStockThreshold: number
    orderConfirmation: boolean
  }
  compliance: {
    autoReporting: boolean
    reportFrequency: string
    healthCanadaIntegration: boolean
    auditLogging: boolean
    dataRetention: number
    encryptionEnabled: boolean
  }
}

export default function SettingsSystem() {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    profile: {
      name: 'John Doe',
      email: 'john.doe@cannabisos.com',
      phone: '+1-416-555-0123',
      avatar: '',
      bio: 'Store Manager with 5+ years of experience in cannabis retail.'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      lowStock: true,
      compliance: true
    },
    appearance: {
      theme: 'system',
      language: 'en',
      timezone: 'America/Toronto',
      dateFormat: 'YYYY-MM-DD',
      currency: 'CAD'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordStrength: 'medium',
      loginAlerts: true
    }
  })

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    general: {
      name: 'Toronto Main Dispensary',
      email: 'info@torontodispensary.ca',
      phone: '+1-416-555-0123',
      address: '123 Queen Street West',
      city: 'Toronto',
      province: 'Ontario',
      postalCode: 'M5V 2N6',
      country: 'Canada',
      licenseNumber: 'LIC-2024-001234',
      timezone: 'America/Toronto',
      currency: 'CAD'
    },
    operations: {
      autoAgeVerification: true,
      requireIdVerification: true,
      allowOnlineOrders: true,
      allowDelivery: true,
      inventoryAlerts: true,
      lowStockThreshold: 10,
      orderConfirmation: true
    },
    compliance: {
      autoReporting: true,
      reportFrequency: 'monthly',
      healthCanadaIntegration: true,
      auditLogging: true,
      dataRetention: 2555, // 7 years in days
      encryptionEnabled: true
    }
  })

  const [activeTab, setActiveTab] = useState('profile')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const saveUserSettings = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const saveStoreSettings = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const exportData = async (type: string) => {
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Exporting ${type} data...`)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const importData = async (type: string) => {
    try {
      // Simulate data import
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Importing ${type} data...`)
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'saved': return <Save className="h-4 w-4 text-green-600" />
      case 'error': return <RefreshCw className="h-4 w-4 text-red-600" />
      default: return null
    }
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...'
      case 'saved': return 'Saved successfully!'
      case 'error': return 'Save failed. Please try again.'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account, store, and system preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>
                      {userSettings.profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{userSettings.profile.name}</h3>
                    <p className="text-sm text-gray-500">{userSettings.profile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userSettings.profile.name}
                      onChange={(e) => setUserSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.profile.email}
                      onChange={(e) => setUserSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userSettings.profile.phone}
                      onChange={(e) => setUserSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userSettings.profile.bio}
                      onChange={(e) => setUserSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, bio: e.target.value }
                      }))}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <Button onClick={saveUserSettings} className="w-full">
                  {getSaveStatusIcon()}
                  <span className="ml-2">
                    {getSaveStatusText() || 'Save Profile'}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input
                      id="store-name"
                      value={storeSettings.general.name}
                      onChange={(e) => setStoreSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-email">Store Email</Label>
                    <Input
                      id="store-email"
                      type="email"
                      value={storeSettings.general.email}
                      onChange={(e) => setStoreSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-phone">Store Phone</Label>
                    <Input
                      id="store-phone"
                      value={storeSettings.general.phone}
                      onChange={(e) => setStoreSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license-number">License Number</Label>
                    <Input
                      id="license-number"
                      value={storeSettings.general.licenseNumber}
                      onChange={(e) => setStoreSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, licenseNumber: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="store-address">Store Address</Label>
                  <Textarea
                    id="store-address"
                    value={`${storeSettings.general.address}, ${storeSettings.general.city}, ${storeSettings.general.province} ${storeSettings.general.postalCode}`}
                    onChange={(e) => {
                      const addressParts = e.target.value.split(',')
                      setStoreSettings(prev => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          address: addressParts[0]?.trim() || '',
                          city: addressParts[1]?.trim() || '',
                          province: addressParts[2]?.trim() || '',
                          postalCode: addressParts[3]?.trim() || ''
                        }
                      }))
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                    <Input
                      id="low-stock-threshold"
                      type="number"
                      value={storeSettings.operations.lowStockThreshold}
                      onChange={(e) => setStoreSettings(prev => ({
                        ...prev,
                        operations: { ...prev.operations, lowStockThreshold: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="data-retention">Data Retention (days)</Label>
                    <Input
                      id="data-retention"
                      type="number"
                      value={storeSettings.compliance.dataRetention}
                      onChange={(e) => setStoreSettings(prev => ({
                        ...prev,
                        compliance: { ...prev.compliance, dataRetention: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={userSettings.security.sessionTimeout}
                      onChange={(e) => setUserSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Operations Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Auto Age Verification</Label>
                      <Switch
                        checked={storeSettings.operations.autoAgeVerification}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          operations: { ...prev.operations, autoAgeVerification: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require ID Verification</Label>
                      <Switch
                        checked={storeSettings.operations.requireIdVerification}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          operations: { ...prev.operations, requireIdVerification: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow Online Orders</Label>
                      <Switch
                        checked={storeSettings.operations.allowOnlineOrders}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          operations: { ...prev.operations, allowOnlineOrders: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow Delivery</Label>
                      <Switch
                        checked={storeSettings.operations.allowDelivery}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          operations: { ...prev.operations, allowDelivery: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Compliance Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Auto Reporting</Label>
                      <Switch
                        checked={storeSettings.compliance.autoReporting}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, autoReporting: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Health Canada Integration</Label>
                      <Switch
                        checked={storeSettings.compliance.healthCanadaIntegration}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, healthCanadaIntegration: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Audit Logging</Label>
                      <Switch
                        checked={storeSettings.compliance.auditLogging}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, auditLogging: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Encryption Enabled</Label>
                      <Switch
                        checked={storeSettings.compliance.encryptionEnabled}
                        onCheckedChange={(checked) => setStoreSettings(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, encryptionEnabled: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={saveStoreSettings} className="w-full">
                  {getSaveStatusIcon()}
                  <span className="ml-2">
                    {getSaveStatusText() || 'Save Store Settings'}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.email}
                      onCheckedChange={(checked) => setUserSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.push}
                      onCheckedChange={(checked) => setUserSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive text message alerts</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.sms}
                      onCheckedChange={(checked) => setUserSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: checked }
                      }))}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Alert Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Order Updates</Label>
                      <Switch
                        checked={userSettings.notifications.orderUpdates}
                        onCheckedChange={(checked) => setUserSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, orderUpdates: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Low Stock Alerts</Label>
                      <Switch
                        checked={userSettings.notifications.lowStock}
                        onCheckedChange={(checked) => setUserSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, lowStock: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Compliance Alerts</Label>
                      <Switch
                        checked={userSettings.notifications.compliance}
                        onCheckedChange={(checked) => setUserSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, compliance: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={saveUserSettings} className="w-full">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Authentication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={userSettings.security.twoFactor}
                        onCheckedChange={(checked) => setUserSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                      </div>
                      <Switch
                        checked={userSettings.security.loginAlerts}
                        onCheckedChange={(checked) => setUserSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, loginAlerts: checked }
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password-strength">Password Strength Requirement</Label>
                    <Select
                      value={userSettings.security.passwordStrength}
                      onValueChange={(value) => setUserSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, passwordStrength: value as any }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Data Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => exportData('user')}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export User Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => importData('user')}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import User Data
                    </Button>
                  </div>
                </div>

                <Button onClick={saveUserSettings} className="w-full">
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Appearance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={userSettings.appearance.theme}
                        onValueChange={(value) => setUserSettings(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, theme: value as any }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={userSettings.appearance.language}
                        onValueChange={(value) => setUserSettings(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, language: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={userSettings.appearance.timezone}
                        onValueChange={(value) => setUserSettings(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, timezone: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Toronto">Toronto</SelectItem>
                          <SelectItem value="America/Vancouver">Vancouver</SelectItem>
                          <SelectItem value="America/Montreal">Montreal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select
                        value={userSettings.appearance.dateFormat}
                        onValueChange={(value) => setUserSettings(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, dateFormat: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">System Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => exportData('system')}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export System Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => importData('system')}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import System Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simulate system backup
                        console.log('Creating system backup...')
                      }}
                      className="w-full"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        // Simulate system reset
                        if (confirm('Are you sure you want to reset system settings? This action cannot be undone.')) {
                          console.log('Resetting system settings...')
                        }
                      }}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset System
                    </Button>
                  </div>
                </div>

                <Button onClick={saveUserSettings} className="w-full">
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}