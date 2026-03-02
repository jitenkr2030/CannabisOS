'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Globe, 
  Zap, 
  Database, 
  Cloud, 
  Plug, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  Filter, 
  Activity, 
  Shield, 
  Key, 
  Wifi, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Navigation, 
  Truck, 
  Package, 
  ShoppingCart, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  FileText, 
  BarChart3, 
  LineChart, 
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Link,
  Link2,
  ExternalLink,
  Api,
  Webhook,
  Lock,
  Unlock
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: 'payment' | 'shipping' | 'inventory' | 'analytics' | 'crm' | 'accounting' | 'compliance' | 'communication' | 'storage' | 'security' | 'other'
  category: string
  description: string
  provider: string
  status: 'active' | 'inactive' | 'error' | 'configuring' | 'deprecated'
  icon: string
  logo: string
  documentation: string
  supportedFeatures: string[]
  pricing: {
    model: 'free' | 'tiered' | 'usage' | 'custom'
    plans?: Array<{
      name: string
      price: number
      features: string[]
      limits?: Record<string, any>
    }>
  }
  configuration: {
    apiKey?: string
    secretKey?: string
    webhookUrl?: string
    environment: 'sandbox' | 'production'
    customSettings?: Record<string, any>
  }
  statistics: {
    totalRequests: number
    successRate: number
    averageResponseTime: number
    lastSync: Date
    errors: number
    dataVolume: number
  }
  capabilities: {
    realTime: boolean
    biDirectional: boolean
    webhookSupport: boolean
    apiAccess: boolean
    bulkOperations: boolean
    customFields: boolean
    automation: boolean
    reporting: boolean
  }
  connections: {
    inbound: Array<{
      id: string
      name: string
      type: string
      status: 'active' | 'inactive' | 'error'
      lastSync: Date
      dataFlow: string
    }>
    outbound: Array<{
      id: string
      name: string
      type: string
      status: 'active' | 'inactive' | 'error'
      lastSync: Date
      dataFlow: string
    }>
  }
  security: {
    encryption: boolean
    authentication: 'api_key' | 'oauth' | 'basic' | 'certificate'
    compliance: string[]
    auditLogging: boolean
    dataRetention: string
  }
  createdAt: Date
  updatedAt: Date
}

interface IntegrationTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  icon: string
  popularity: number
  difficulty: 'easy' | 'medium' | 'advanced'
  estimatedTime: string
  prerequisites: string[]
  steps: Array<{
    title: string
    description: string
    type: 'configuration' | 'validation' | 'testing' | 'deployment'
    required: boolean
    expectedOutcome: string
    troubleshooting?: string[]
  }>
  configuration: Record<string, any>
  validation: {
    tests: Array<{
      name: string
      type: 'connection' | 'data' | 'functionality' | 'performance'
      expected: string
      actual?: string
      status: 'passed' | 'failed' | 'skipped'
      error?: string
    }>
  }
}

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [templates, setTemplates] = useState<IntegrationTemplate[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockIntegrations: Integration[] = [
      {
        id: 'stripe_payments',
        name: 'Stripe Payments',
        type: 'payment',
        category: 'Financial',
        description: 'Complete payment processing with Stripe',
        provider: 'Stripe',
        status: 'active',
        icon: 'credit-card',
        logo: '/integrations/stripe.svg',
        documentation: 'https://stripe.com/docs',
        supportedFeatures: ['credit_card', 'debit_card', 'bank_transfer', 'subscriptions', 'refunds', 'disputes'],
        pricing: {
          model: 'tiered',
          plans: [
            {
              name: 'Standard',
              price: 2.9,
              features: ['basic_processing', 'standard_support'],
              limits: { 'monthly_volume': 1000000 }
            },
            {
              name: 'Advanced',
              price: 5.9,
              features: ['advanced_processing', 'priority_support', 'radar'],
              limits: { 'monthly_volume': 5000000 }
            }
          ]
        },
        configuration: {
          apiKey: 'sk_test_1234567890abcdef',
          secretKey: 'sk_live_1234567890abcdef',
          webhookUrl: 'https://api.cannabisos.com/webhooks/stripe',
          environment: 'production'
        },
        statistics: {
          totalRequests: 1250,
          successRate: 98.5,
          averageResponseTime: 234,
          lastSync: new Date('2024-01-16'),
          errors: 3,
          dataVolume: 15678.90
        },
        capabilities: {
          realTime: true,
          biDirectional: true,
          webhookSupport: true,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [
            {
              id: 'stripe_webhook',
              name: 'Stripe Webhook',
              type: 'webhook',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'stripe → cannabisos'
            }
          ],
          outbound: [
            {
              id: 'stripe_api',
              name: 'Stripe API',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → stripe'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'api_key',
          compliance: ['PCI DSS', 'GDPR', 'SOC 2'],
          auditLogging: true,
          dataRetention: '7_years'
        },
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'shipstation_shipping',
        name: 'ShipStation',
        type: 'shipping',
        category: 'Logistics',
        description: 'Shipping and fulfillment automation',
        provider: 'ShipStation',
        status: 'active',
        icon: 'truck',
        logo: '/integrations/shipstation.svg',
        documentation: 'https://www.shipstation.com/docs',
        supportedFeatures: ['order_import', 'label_creation', 'rate_calculation', 'tracking', 'returns'],
        pricing: {
          model: 'tiered',
          plans: [
            {
              name: 'Starter',
              price: 9.99,
              features: ['basic_shipping', 'email_support'],
              limits: { 'monthly_shipments': 50 }
            },
            {
              name: 'Professional',
              price: 29.99,
              features: ['advanced_shipping', 'phone_support', 'automation'],
              limits: { 'monthly_shipments': 500 }
            }
          ]
        },
        configuration: {
          apiKey: '1234567890abcdef',
          secretKey: 'abcdef1234567890',
          webhookUrl: 'https://api.cannabisos.com/webhooks/shipstation',
          environment: 'production'
        },
        statistics: {
          totalRequests: 456,
          successRate: 99.2,
          averageResponseTime: 456,
          lastSync: new Date('2024-01-16'),
          errors: 1,
          dataVolume: 234
        },
        capabilities: {
          realTime: true,
          biDirectional: true,
          webhookSupport: true,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [
            {
              id: 'shipstation_webhook',
              name: 'ShipStation Webhook',
              type: 'webhook',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'shipstation → cannabisos'
            }
          ],
          outbound: [
            {
              id: 'shipstation_api',
              name: 'ShipStation API',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → shipstation'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'api_key',
          compliance: ['SOC 2', 'GDPR'],
          auditLogging: true,
          dataRetention: '2_years'
        },
        createdAt: new Date('2023-08-20'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'quickbooks_accounting',
        name: 'QuickBooks Online',
        type: 'accounting',
        category: 'Financial',
        description: 'Accounting and financial management',
        provider: 'Intuit',
        status: 'active',
        icon: 'calculator',
        logo: '/integrations/quickbooks.svg',
        documentation: 'https://developer.intuit.com/docs/quickbooks/v4',
        supportedFeatures: ['invoice_sync', 'expense_tracking', 'journal_entries', 'reports', 'tax_calculation'],
        pricing: {
          model: 'tiered',
          plans: [
            {
              name: 'Simple Start',
              price: 25,
              features: ['basic_accounting', 'email_support'],
              limits: { 'monthly_transactions': 20 }
            },
            {
              name: 'Essentials',
              price: 50,
              features: ['advanced_accounting', 'phone_support', 'multi_user'],
              limits: { 'monthly_transactions': 100 }
            }
          ]
        },
        configuration: {
          apiKey: 'quickbooks_api_key',
          secretKey: 'quickbooks_secret',
          webhookUrl: 'https://api.cannabisos.com/webhooks/quickbooks',
          environment: 'production'
        },
        statistics: {
          totalRequests: 234,
          successRate: 97.8,
          averageResponseTime: 567,
          lastSync: new Date('2024-01-16'),
          errors: 2,
          dataVolume: 45678.90
        },
        capabilities: {
          realTime: false,
          biDirectional: true,
          webhookSupport: true,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [
            {
              id: 'quickbooks_webhook',
              name: 'QuickBooks Webhook',
              type: 'webhook',
              status: 'active',
              lastSync: new Date('2024-01-15'),
              dataFlow: 'quickbooks → cannabisos'
            }
          ],
          outbound: [
            {
              id: 'quickbooks_api',
              name: 'QuickBooks API',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → quickbooks'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'oauth',
          compliance: ['SOC 2', 'GDPR', 'HIPAA'],
          auditLogging: true,
          dataRetention: '7_years'
        },
        createdAt: new Date('2023-09-10'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'slack_communication',
        name: 'Slack',
        type: 'communication',
        category: 'Productivity',
        description: 'Team communication and notifications',
        provider: 'Slack',
        status: 'active',
        icon: 'message-circle',
        logo: '/integrations/slack.svg',
        documentation: 'https://api.slack.com/docs',
        supportedFeatures: ['message_sending', 'channel_management', 'file_sharing', 'notifications', 'bots'],
        pricing: {
          model: 'tiered',
          plans: [
            {
              name: 'Free',
              price: 0,
              features: ['basic_messaging', 'limited_history'],
              limits: { 'messages_per_month': 10000 }
            },
            {
              name: 'Pro',
              price: 8.75,
              features: ['unlimited_messaging', 'full_history', 'integrations'],
              limits: { 'messages_per_month': 'unlimited' }
            }
          ]
        },
        configuration: {
          botToken: 'xoxb-1234567890abcdef',
          signingSecret: '1234567890abcdef',
          webhookUrl: 'https://api.cannabisos.com/webhooks/slack',
          environment: 'production'
        },
        statistics: {
          totalRequests: 89,
          successRate: 100.0,
          averageResponseTime: 123,
          lastSync: new Date('2024-01-16'),
          errors: 0,
          dataVolume: 12
        },
        capabilities: {
          realTime: true,
          biDirectional: true,
          webhookSupport: true,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [
            {
              id: 'slack_webhook',
              name: 'Slack Webhook',
              type: 'webhook',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'slack → cannabisos'
            }
          ],
          outbound: [
            {
              id: 'slack_api',
              name: 'Slack API',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → slack'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'bot_token',
          compliance: ['SOC 2', 'GDPR'],
          auditLogging: true,
          dataRetention: '90_days'
        },
        createdAt: new Date('2023-10-05'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'google_analytics',
        name: 'Google Analytics',
        type: 'analytics',
        category: 'Marketing',
        description: 'Web analytics and marketing insights',
        provider: 'Google',
        status: 'active',
        icon: 'bar-chart',
        logo: '/integrations/google-analytics.svg',
        documentation: 'https://developers.google.com/analytics/devguides',
        supportedFeatures: ['page_tracking', 'event_tracking', 'conversion_tracking', 'custom_reports', 'real_time_data'],
        pricing: {
          model: 'tiered',
          plans: [
            {
              name: 'Standard',
              price: 0,
              features: ['basic_analytics', 'standard_reports'],
              limits: { 'monthly_hits': 10000000 }
            },
            {
              name: '360',
              price: 150000,
              features: ['advanced_analytics', 'unlimited_data', 'custom_dimensions'],
              limits: { 'monthly_hits': 'unlimited' }
            }
          ]
        },
        configuration: {
          trackingId: 'GA-1234567890',
          measurementId: 'G-1234567890',
          apiKey: 'google_api_key',
          environment: 'production'
        },
        statistics: {
          totalRequests: 567,
          successRate: 99.8,
          averageResponseTime: 89,
          lastSync: new Date('2024-01-16'),
          errors: 0,
          dataVolume: 345678
        },
        capabilities: {
          realTime: true,
          biDirectional: false,
          webhookSupport: false,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [
            {
              id: 'ga_data_import',
              name: 'GA Data Import',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'google_analytics → cannabisos'
            }
          ],
          outbound: [
            {
              id: 'ga_data_export',
              name: 'GA Data Export',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → google_analytics'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'api_key',
          compliance: ['SOC 2', 'GDPR'],
          auditLogging: true,
          dataRetention: '26_months'
        },
        createdAt: new Date('2023-07-15'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'aws_s3_storage',
        name: 'AWS S3',
        type: 'storage',
        category: 'Infrastructure',
        description: 'Cloud storage and file management',
        provider: 'Amazon Web Services',
        status: 'active',
        icon: 'cloud',
        logo: '/integrations/aws-s3.svg',
        documentation: 'https://docs.aws.amazon.com/s3/',
        supportedFeatures: ['file_storage', 'backup', 'cdn', 'versioning', 'encryption'],
        pricing: {
          model: 'usage',
          plans: []
        },
        configuration: {
          accessKeyId: 'AKIA1234567890abcdef',
          secretAccessKey: 'abcdef1234567890',
          bucket: 'cannabisos-storage',
          region: 'us-east-1',
          environment: 'production'
        },
        statistics: {
          totalRequests: 1234,
          successRate: 100.0,
          averageResponseTime: 45,
          lastSync: new Date('2024-01-16'),
          errors: 0,
          dataVolume: 1234567
        },
        capabilities: {
          realTime: true,
          biDirectional: true,
          webhookSupport: false,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [],
          outbound: [
            {
              id: 's3_sync',
              name: 'S3 Sync',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → aws_s3'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'access_key',
          compliance: ['SOC 2', 'GDPR', 'HIPAA'],
          auditLogging: true,
          dataRetention: 'customizable'
        },
        createdAt: new Date('2023-05-20'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'zapier_automation',
        name: 'Zapier',
        type: 'other',
        category: 'Automation',
        description: 'Workflow automation and integration platform',
        provider: 'Zapier',
        status: 'active',
        icon: 'zap',
        logo: '/integrations/zapier.svg',
        documentation: 'https://zapier.com/developer',
        supportedFeatures: ['workflow_automation', 'app_integration', 'data_mapping', 'scheduling', 'error_handling'],
        pricing: {
          model: 'tiered',
          plans: [
            {
              name: 'Free',
              price: 0,
              features: ['100_tasks/month', 'basic_apps'],
              limits: { 'tasks_per_month': 100 }
            },
            {
              name: 'Professional',
              price: 20,
              features: ['750_tasks/month', 'premium_apps', 'multi_step_zaps'],
              limits: { 'tasks_per_month': 750 }
            }
          ]
        },
        configuration: {
          apiKey: 'zapier_api_key',
          environment: 'production'
        },
        statistics: {
          totalRequests: 234,
          successRate: 96.5,
          averageResponseTime: 234,
          lastSync: new Date('2024-01-16'),
          errors: 4,
          dataVolume: 567
        },
        capabilities: {
          realTime: true,
          biDirectional: true,
          webhookSupport: true,
          apiAccess: true,
          bulkOperations: true,
          customFields: true,
          automation: true,
          reporting: true
        },
        connections: {
          inbound: [
            {
              id: 'zapier_webhook',
              name: 'Zapier Webhook',
              type: 'webhook',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'zapier → cannabisos'
            }
          ],
          outbound: [
            {
              id: 'zapier_api',
              name: 'Zapier API',
              type: 'api',
              status: 'active',
              lastSync: new Date('2024-01-16'),
              dataFlow: 'cannabisos → zapier'
            }
          ]
        },
        security: {
          encryption: true,
          authentication: 'api_key',
          compliance: ['SOC 2', 'GDPR'],
          auditLogging: true,
          dataRetention: '30_days'
        },
        createdAt: new Date('2023-11-10'),
        updatedAt: new Date('2024-01-16')
      }
    ]

    const mockTemplates: IntegrationTemplate[] = [
      {
        id: 'stripe_quickbooks_sync',
        name: 'Stripe-QuickBooks Sync',
        description: 'Automatically sync Stripe transactions with QuickBooks',
        category: 'Financial',
        type: 'payment',
        icon: 'sync',
        popularity: 95,
        difficulty: 'medium',
        estimatedTime: '30-45 minutes',
        prerequisites: ['Active Stripe account', 'Active QuickBooks account', 'API access'],
        steps: [
          {
            title: 'Configure Stripe API',
            description: 'Set up Stripe API keys and webhook endpoints',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Stripe API connected and authenticated'
          },
          {
            title: 'Configure QuickBooks API',
            description: 'Set up QuickBooks OAuth credentials and API access',
            type: 'configuration',
            required: true,
            expectedOutcome: 'QuickBooks API connected and authenticated'
          },
          {
            title: 'Create data mapping',
            description: 'Define how Stripe transactions map to QuickBooks journal entries',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Data mapping rules established'
          },
          {
            title: 'Test transaction sync',
            description: 'Verify test transactions sync correctly between systems',
            type: 'testing',
            required: true,
            expectedOutcome: 'Test transactions appear in both systems',
            troubleshooting: ['Check API credentials', 'Verify webhook delivery', 'Validate data format']
          },
          {
            title: 'Deploy automation',
            description: 'Activate the automated sync workflow',
            type: 'deployment',
            required: true,
            expectedOutcome: 'Live automation running'
          }
        ],
        configuration: {
          stripe: {
            apiKey: 'sk_test_1234567890abcdef',
            webhookUrl: 'https://api.cannabisos.com/webhooks/stripe'
          },
          quickbooks: {
            clientId: 'quickbooks_client_id',
            clientSecret: 'quickbooks_client_secret',
            realmId: '1234567890'
          }
        },
        validation: {
          tests: [
            {
              name: 'Stripe Connection',
              type: 'connection',
              expected: 'Connected to Stripe API',
              status: 'passed'
            },
            {
              name: 'QuickBooks Connection',
              type: 'connection',
              expected: 'Connected to QuickBooks API',
              status: 'passed'
            },
            {
              name: 'Transaction Sync',
              type: 'data',
              expected: 'Transactions synced within 5 minutes',
              status: 'passed'
            },
            {
              name: 'Financial Accuracy',
              type: 'functionality',
              expected: 'Balances match within 0.01%',
              status: 'passed'
            }
          ]
        }
      },
      {
        id: 'shipstation_slack_notifications',
        name: 'ShipStation-Slack Notifications',
        description: 'Send shipping updates to Slack channels',
        category: 'Logistics',
        type: 'shipping',
        icon: 'truck',
        popularity: 88,
        difficulty: 'easy',
        estimatedTime: '15-20 minutes',
        prerequisites: ['Active ShipStation account', 'Slack workspace', 'Bot permissions'],
        steps: [
          {
            title: 'Create Slack bot',
            description: 'Create and configure Slack bot for notifications',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Slack bot created and authorized'
          },
          {
            title: 'Configure ShipStation webhook',
            description: 'Set up ShipStation webhook to send notifications',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Webhook configured and tested'
          },
          {
            title: 'Create notification rules',
            description: 'Define when and what notifications to send',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Notification rules established'
          },
          {
            title: 'Test notifications',
            description: 'Send test notifications and verify delivery',
            type: 'testing',
            required: true,
            expectedOutcome: 'Test notifications received in Slack',
            troubleshooting: ['Check bot permissions', 'Verify webhook URL', 'Test message format']
          }
        ],
        configuration: {
          shipstation: {
            apiKey: '1234567890abcdef',
            webhookUrl: 'https://hooks.slack.com/services/T1234567890abcdef'
          },
          slack: {
            botToken: 'xoxb-1234567890abcdef',
            channel: '#shipping-updates'
          }
        },
        validation: {
          tests: [
            {
              name: 'Slack Bot Connection',
              type: 'connection',
              expected: 'Bot connected to Slack workspace',
              status: 'passed'
            },
            {
              name: 'ShipStation Webhook',
              type: 'connection',
              expected: 'Webhook receives ShipStation events',
              status: 'passed'
            },
            {
              name: 'Message Delivery',
              type: 'functionality',
              expected: 'Messages posted to specified channel',
              status: 'passed'
            },
            {
              name: 'Message Format',
              type: 'data',
              expected: 'Messages contain required shipping information',
              status: 'passed'
            }
          ]
        }
      },
      {
        id: 'google_analytics_s3_backup',
        name: 'GA Data Backup to S3',
        description: 'Automatically backup Google Analytics data to AWS S3',
        category: 'Infrastructure',
        type: 'storage',
        icon: 'database',
        popularity: 72,
        difficulty: 'advanced',
        estimatedTime: '45-60 minutes',
        prerequisites: ['Google Analytics account', 'AWS S3 bucket', 'IAM permissions'],
        steps: [
          {
            title: 'Configure AWS S3',
            description: 'Set up S3 bucket and IAM policies for data storage',
            type: 'configuration',
            required: true,
            expectedOutcome: 'S3 bucket ready with proper permissions'
          },
          {
            title: 'Configure Google Analytics API',
            description: 'Set up GA API access and data export settings',
            type: 'configuration',
            required: true,
            expectedOutcome: 'GA API configured for data export'
          },
          {
            title: 'Create backup script',
            description: 'Develop script to fetch and backup GA data',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Backup script created and tested'
          },
          {
            title: 'Set up automation',
            description: 'Configure scheduled backup automation',
            type: 'configuration',
            required: true,
            expectedOutcome: 'Automation scheduled and running'
          },
          {
            title: 'Test backup process',
            description: 'Verify data backup and restoration capabilities',
            type: 'testing',
            required: true,
            expectedOutcome: 'Data backed up and can be restored',
            troubleshooting: ['Check IAM permissions', 'Verify API quotas', 'Test data integrity']
          }
        ],
        configuration: {
          aws: {
            accessKeyId: 'AKIA1234567890abcdef',
            secretAccessKey: 'abcdef1234567890',
            bucket: 'ga-backup-bucket',
            region: 'us-east-1'
          },
          googleAnalytics: {
            clientId: 'google_client_id',
            clientSecret: 'google_client_secret',
            viewId: '123456789'
          }
        },
        validation: {
          tests: [
            {
              name: 'S3 Access',
              type: 'connection',
              expected: 'Can access S3 bucket with provided credentials',
              status: 'passed'
            },
            {
              name: 'GA API Access',
              type: 'connection',
              expected: 'Can access GA API with provided credentials',
              status: 'passed'
            },
            {
              name: 'Data Backup',
              type: 'data',
              expected: 'GA data backed up to S3',
              status: 'passed'
            },
            {
              name: 'Data Integrity',
              type: 'functionality',
              expected: 'Backed up data matches original GA data',
              status: 'passed'
            },
            {
              name: 'Automation Schedule',
              type: 'performance',
              expected: 'Backup runs on schedule',
              status: 'passed'
            }
          ]
        }
      }
    ]

    setIntegrations(mockIntegrations)
    setTemplates(mockTemplates)
  }, [])

  // Get integration type icon
  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-5 w-5" />
      case 'shipping': return <Truck className="h-5 w-5" />
      case 'inventory': return <Package className="h-5 w-5" />
      case 'analytics': return <BarChart3 className="h-5 w-5" />
      case 'crm': return <Users className="h-5 w-5" />
      case 'accounting': return <Calculator className="h-5 w-5" />
      case 'compliance': return <Shield className="h-5 w-5" />
      case 'communication': return <Mail className="h-5 w-5" />
      case 'storage': return <Database className="h-5 w-5" />
      case 'security': return <Lock className="h-5 w-5" />
      default: return <Plug className="h-5 w-5" />
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'configuring': return 'bg-blue-100 text-blue-800'
      case 'deprecated': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get capability icons
  const getCapabilityIcon = (capability: string, enabled: boolean) => {
    const iconClass = enabled ? 'text-green-600' : 'text-gray-400'
    switch (capability) {
      case 'realTime': return <Activity className={`h-4 w-4 ${iconClass}`} />
      case 'biDirectional': return <RefreshCw className={`h-4 w-4 ${iconClass}`} />
      case 'webhookSupport': return <Webhook className={`h-4 w-4 ${iconClass}`} />
      case 'apiAccess': return <Api className={`h-4 w-4 ${iconClass}`} />
      case 'bulkOperations': return <Database className={`h-4 w-4 ${iconClass}`} />
      case 'automation': return <Zap className={`h-4 w-4 ${iconClass}`} />
      case 'reporting': return <BarChart3 className={`h-4 w-4 ${iconClass}`} />
      default: return <Settings className={`h-4 w-4 ${iconClass}`} />
    }
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || integration.type === filterType
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredTemplates = templates.filter(template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           template.description.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Test integration connection
  const testConnection = async (integrationId: string): Promise<boolean> => {
    const integration = integrations.find(i => i.id === integrationId)
    if (!integration) return false

    // Simulate connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.1) // 90% success rate
      }, 1000 + Math.random() * 2000) // 1-3 seconds
    })
  }

  // Sync integration data
  const syncData = async (integrationId: string, direction: 'inbound' | 'outbound'): Promise<boolean> => {
    const integration = integrations.find(i => i.id === integrationId)
    if (!integration) return false

    // Simulate data sync
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.05) // 95% success rate
      }, 2000 + Math.random() * 3000) // 2-5 seconds
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
          <p className="text-gray-600">Connect and automate your business with powerful integrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.filter(i => i.status === 'active').length}</p>
              </div>
              <Plug className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.length > 0 
                    ? (integrations.reduce((acc, i) => acc + i.statistics.successRate, 0) / integrations.length * 100).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.reduce((acc, i) => acc + i.statistics.dataVolume, 0).toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.reduce((acc, i) => acc + i.statistics.errors, 0)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.slice(0, 5).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(integration.status)}`}>
                          {getIntegrationIcon(integration.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.provider}</p>
                          <p className="text-xs text-gray-400">{integration.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          <p className="text-sm text-gray-500">
                            {(integration.statistics.successRate * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.slice(0, 5).map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-blue-100 text-blue-800`}>
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-500">
                              {template.popularity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {template.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="payment">Payment</option>
                <option value="shipping">Shipping</option>
                <option value="inventory">Inventory</option>
                <option value="analytics">Analytics</option>
                <option value="crm">CRM</option>
                <option value="accounting">Accounting</option>
                <option value="compliance">Compliance</option>
                <option value="communication">Communication</option>
                <option value="storage">Storage</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
                <option value="configuring">Configuring</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(integration.status)}`}>
                        {getIntegrationIcon(integration.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.provider}</p>
                        <p className="text-xs text-gray-400">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Link className="h-4 w-4 text-blue-600" href={integration.documentation} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {/* View details */}}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium capitalize">{integration.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-medium">{integration.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pricing</p>
                        <p className="font-medium capitalize">{integration.pricing.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Sync</p>
                        <p className="font-medium">{integration.statistics.lastSync.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Capabilities</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          {getCapabilityIcon('realTime', integration.capabilities.realTime)}
                          <span className="text-xs text-gray-600">Real-time</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getCapabilityIcon('webhookSupport', integration.capabilities.webhookSupport)}
                          <span className="text-xs text-gray-600">Webhooks</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getCapabilityIcon('apiAccess', integration.capabilities.apiAccess)}
                          <span className="text-xs text-gray-600">API</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getCapabilityIcon('automation', integration.capabilities.automation)}
                          <span className="text-xs text-gray-600">Automation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getCapabilityIcon('reporting', integration.capabilities.reporting)}
                          <span className="text-xs text-gray-600">Reporting</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Requests: {integration.statistics.totalRequests} | 
                          Success: {(integration.statistics.successRate * 100).toFixed(1)}% | 
                          Errors: {integration.statistics.errors}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testConnection(integration.id)}
                          >
                            Test Connection
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncData(integration.id, 'outbound')}
                          >
                            Sync Data
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedIntegration(integration)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-blue-100 text-blue-800`}>
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {template.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-500">
                          {template.popularity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{template.category}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Prerequisites</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Steps</p>
                      <div className="space-y-2">
                        {template.steps.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <div className={`w-2 h-2 rounded-full ${
                              step.type === 'configuration' ? 'bg-blue-500' :
                              step.type === 'testing' ? 'bg-yellow-500' :
                              step.type === 'deployment' ? 'bg-green-500' :
                              'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{step.title}</p>
                              <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        ))}
                        {template.steps.length > 3 && (
                          <p className="text-sm text-gray-500 text-center">
                            +{template.steps.length - 3} more steps
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Estimated time: {template.estimatedTime}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {/* Deploy template */}}
                          >
                            Deploy Template
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* View details */}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.filter(i => i.capabilities.automation).map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(integration.status)}`}>
                            {getIntegrationIcon(integration.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{integration.name} Automation</h3>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          <p className="text-sm text-gray-500">
                            {integration.connections.outbound.length} workflows
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Active Workflows:</p>
                          <div className="space-y-1">
                            {integration.connections.outbound.map((workflow, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{workflow.name}</span>
                                <span className="text-xs text-gray-500">{workflow.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.filter(t => t.name.includes('Workflow')).map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-blue-100 text-blue-800`}>
                            <Zap className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {template.difficulty}
                          </Badge>
                          <p className="text-xs text-gray-500">{template.estimatedTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          integration.statistics.successRate > 0.95 ? 'bg-green-500' :
                          integration.statistics.successRate > 0.85 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-gray-500">
                            Status: {integration.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          <p>Success: {(integration.statistics.successRate * 100).toFixed(1)}%</p>
                          <p>Errors: {integration.statistics.errors}</p>
                          <p>Response: {integration.statistics.averageResponseTime}ms</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testConnection(integration.id)}
                          >
                            Test
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncData(integration.id, 'outbound')}
                          >
                            Sync
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.filter(i => i.statistics.errors > 0).map((integration) => (
                    <div key={integration.id} className="p-4 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div>
                            <h3 className="font-semibold text-red-900">{integration.name}</h3>
                            <p className="text-sm text-red-700">
                              {integration.statistics.errors} errors
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-100 text-red-800">
                            {integration.statistics.errors > 10 ? 'Critical' : 'Warning'}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Last error: {integration.statistics.lastSync.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          <strong>Recommended Actions:</strong>
                        </p>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry Failed Operations
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Review Configuration
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
