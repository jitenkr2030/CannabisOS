'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  Download, 
  RefreshCw, 
  Settings, 
  Filter, 
  Search,
  Database,
  Cloud,
  Wind,
  Sun,
  Moon,
  Star,
  Award,
  Trophy,
  Rocket,
  Lightbulb,
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  MapPin,
  Navigation,
  Compass,
  Timer
} from 'lucide-react'

interface PredictionModel {
  id: string
  name: string
  type: 'sales' | 'inventory' | 'customer' | 'financial' | 'operational' | 'market'
  description: string
  accuracy: number
  confidence: number
  lastTrained: Date
  nextTraining: Date
  status: 'active' | 'training' | 'inactive' | 'deprecated'
  features: string[]
  parameters: Record<string, any>
}

interface Prediction {
  id: string
  modelId: string
  modelName: string
  type: 'sales' | 'inventory' | 'customer' | 'financial' | 'operational' | 'market'
  title: string
  description: string
  prediction: any
  confidence: number
  timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly'
  actualValue?: any
  accuracy?: number
  status: 'pending' | 'confirmed' | 'incorrect' | 'expired'
  createdAt: Date
  confirmedAt?: Date
  expiresAt: Date
  impact: 'low' | 'medium' | 'high' | 'critical'
  actions: Array<{
    type: 'alert' | 'recommendation' | 'automation'
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'completed' | 'ignored'
    dueDate?: Date
  }>
  metadata: Record<string, any>
}

interface Metric {
  id: string
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  changePercent: number
  period: 'hour' | 'day' | 'week' | 'month'
  target?: number
  status: 'on_track' | 'ahead' | 'behind' | 'critical'
  lastUpdated: Date
}

interface Alert {
  id: string
  type: 'prediction' | 'anomaly' | 'threshold' | 'trend'
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  prediction?: Prediction
  metric?: Metric
  threshold?: number
  currentValue?: number
  recommendedAction?: string
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed'
  createdAt: Date
  acknowledgedAt?: Date
  resolvedAt?: Date
  assignee?: string
  tags: string[]
}

interface Forecast {
  id: string
  type: 'sales' | 'inventory' | 'revenue' | 'customers' | 'market'
  title: string
  description: string
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
  predictions: Array<{
    date: Date
    value: number
    confidence: number
    upperBound: number
    lowerBound: number
  }>
  accuracy: number
  model: string
  lastUpdated: Date
  status: 'active' | 'archived' | 'deprecated'
}

export default function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [models, setModels] = useState<PredictionModel[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  useEffect(() => {
    const mockModels: PredictionModel[] = [
      {
        id: 'sales_forecast_lstm',
        name: 'Sales Forecast LSTM',
        type: 'sales',
        description: 'Long Short-Term Memory Network for sales prediction',
        accuracy: 0.92,
        confidence: 0.88,
        lastTrained: new Date('2024-01-10'),
        nextTraining: new Date('2024-01-24'),
        status: 'active',
        features: ['time_series', 'seasonality', 'trend_analysis'],
        parameters: {
          sequence_length: 30,
          hidden_units: 128,
          learning_rate: 0.001,
          epochs: 100
        }
      },
      {
        id: 'inventory_demand_prophet',
        name: 'Inventory Demand Prophet',
        type: 'inventory',
        description: 'Facebook Prophet model for inventory demand forecasting',
        accuracy: 0.89,
        confidence: 0.85,
        lastTrained: new Date('2024-01-08'),
        nextTraining: new Date('2024-01-22'),
        status: 'active',
        features: ['seasonality', 'holiday_effects', 'weather_correlation'],
        parameters: {
          seasonality_mode: 'multiplicative',
          changepoint_prior_scale: 0.05,
          holidays_prior_scale: 10
        }
      },
      {
        id: 'customer_churn_xgboost',
        name: 'Customer Churn XGBoost',
        type: 'customer',
        description: 'Gradient Boosting model for customer churn prediction',
        accuracy: 0.87,
        confidence: 0.83,
        lastTrained: new Date('2024-01-12'),
        nextTraining: new Date('2024-01-26'),
        status: 'active',
        features: ['feature_importance', 'non_linear_patterns', 'ensemble_methods'],
        parameters: {
          n_estimators: 100,
          max_depth: 6,
          learning_rate: 0.1,
          subsample: 0.8
        }
      },
      {
        id: 'revenue_arima',
        name: 'Revenue ARIMA',
        type: 'financial',
        description: 'Autoregressive Integrated Moving Average for revenue prediction',
        accuracy: 0.85,
        confidence: 0.82,
        lastTrained: new Date('2024-01-05'),
        nextTraining: new Date('2024-01-19'),
        status: 'active',
        features: ['time_series', 'stationarity', 'autocorrelation'],
        parameters: {
          order: (2, 1, 1),
          seasonal_order: (1, 1, 0, 12),
          enforce_stationarity: true
        }
      }
    ]

    const mockPredictions: Prediction[] = [
      {
        id: 'pred_1234567890',
        modelId: 'sales_forecast_lstm',
        modelName: 'Sales Forecast LSTM',
        type: 'sales',
        title: 'Weekly Sales Surge Expected',
        description: 'Model predicts 23% increase in sales for next week due to upcoming holiday',
        prediction: {
          current_week: 15678,
          next_week: 19283,
          increase_percentage: 23.0,
          confidence_interval: [18500, 20066],
          contributing_factors: ['holiday_season', 'marketing_campaign', 'weather_conditions']
        },
        confidence: 0.88,
        timeframe: 'weekly',
        status: 'pending',
        createdAt: new Date('2024-01-16'),
        expiresAt: new Date('2024-01-23'),
        impact: 'high',
        actions: [
          {
            type: 'recommendation',
            title: 'Increase Inventory',
            description: 'Stock up on popular items to meet expected demand',
            priority: 'high',
            status: 'pending',
            dueDate: new Date('2024-01-17')
          },
          {
            type: 'automation',
            title: 'Adjust Pricing',
            description: 'Consider dynamic pricing to maximize revenue',
            priority: 'medium',
            status: 'pending'
          }
        ],
        metadata: {
          model_version: 'v2.1.0',
          data_quality_score: 0.95,
          feature_importance: {
            holiday_season: 0.45,
            marketing_campaign: 0.30,
            weather_conditions: 0.25
          }
        }
      },
      {
        id: 'pred_1234567891',
        modelId: 'inventory_demand_prophet',
        modelName: 'Inventory Demand Prophet',
        type: 'inventory',
        title: 'Blue Dream Stock Running Low',
        description: 'Model predicts Blue Dream will be out of stock within 3 days',
        prediction: {
          product: 'Blue Dream',
          current_stock: 45,
          predicted_demand: 78,
          days_until_out_of_stock: 2.8,
          recommended_reorder: 120,
          confidence_level: 0.92
        },
        confidence: 0.85,
        timeframe: 'daily',
        status: 'pending',
        createdAt: new Date('2024-01-16'),
        expiresAt: new Date('2024-01-19'),
        impact: 'critical',
        actions: [
          {
            type: 'alert',
            title: 'Urgent Reorder Required',
            description: 'Place immediate order for Blue Dream to prevent stockout',
            priority: 'urgent',
            status: 'pending',
            dueDate: new Date('2024-01-16')
          },
          {
            type: 'recommendation',
            title: 'Update Safety Stock',
            description: 'Increase safety stock levels for high-demand products',
            priority: 'high',
            status: 'pending'
          }
        ],
        metadata: {
          model_version: 'v1.8.0',
          data_quality_score: 0.88,
          historical_accuracy: 0.91
        }
      },
      {
        id: 'pred_1234567892',
        modelId: 'customer_churn_xgboost',
        modelName: 'Customer Churn XGBoost',
        type: 'customer',
        title: 'High-Risk Customer Identified',
        description: 'Model predicts 15 customers at high risk of churn in next 30 days',
        prediction: {
          at_risk_customers: [
            { id: 'cust_123', name: 'John Doe', risk_score: 0.87, probability: 0.92 },
            { id: 'cust_456', name: 'Jane Smith', risk_score: 0.91, probability: 0.88 },
            { id: 'cust_789', name: 'Bob Johnson', risk_score: 0.83, probability: 0.85 }
          ],
          overall_churn_risk: 0.23,
          expected_revenue_impact: 4567.89,
          intervention_success_probability: 0.67
        },
        confidence: 0.83,
        timeframe: 'monthly',
        status: 'pending',
        createdAt: new Date('2024-01-16'),
        expiresAt: new Date('2024-02-15'),
        impact: 'high',
        actions: [
          {
            type: 'recommendation',
            title: 'Retention Campaign',
            description: 'Launch targeted retention campaign for at-risk customers',
            priority: 'high',
            status: 'pending',
            dueDate: new Date('2024-01-20')
          },
          {
            type: 'automation',
            title: 'Personalized Offers',
            description: 'Generate personalized discount offers for high-risk customers',
            priority: 'medium',
            status: 'pending'
          }
        ],
        metadata: {
          model_version: 'v3.2.1',
          data_quality_score: 0.91,
          intervention_cost_estimate: 1234.56
        }
      },
      {
        id: 'pred_1234567893',
        modelId: 'revenue_arima',
        modelName: 'Revenue ARIMA',
        type: 'financial',
        title: 'Revenue Growth Slowdown Expected',
        description: 'Model predicts revenue growth will slow to 5% next quarter',
        prediction: {
          current_quarter: 125000,
          next_quarter_predicted: 131250,
          growth_rate: 0.05,
          confidence_interval: [128000, 134500],
          market_conditions: 'moderate',
          competitor_activity: 'high'
        },
        confidence: 0.82,
        timeframe: 'quarterly',
        status: 'pending',
        createdAt: new Date('2024-01-16'),
        expiresAt: new Date('2024-04-15'),
        impact: 'medium',
        actions: [
          {
            type: 'recommendation',
            title: 'Marketing Adjustment',
            description: 'Increase marketing spend to maintain growth trajectory',
            priority: 'medium',
            status: 'pending'
          },
          {
            type: 'alert',
            title: 'Investor Communication',
            description: 'Prepare investor communication for growth slowdown',
            priority: 'low',
            status: 'pending',
            dueDate: new Date('2024-01-25')
          }
        ],
        metadata: {
          model_version: 'v1.5.0',
          data_quality_score: 0.87,
          economic_indicators: {
            gdp_growth: 0.023,
            inflation_rate: 0.032,
            consumer_confidence: 0.67
          }
        }
      }
    ]

    const mockAlerts: Alert[] = [
      {
        id: 'alert_1234567890',
        type: 'prediction',
        severity: 'critical',
        title: 'Blue Dream Stockout Imminent',
        message: 'Blue Dream will be out of stock within 48 hours. Urgent reorder required.',
        prediction: mockPredictions[1],
        threshold: 10,
        currentValue: 45,
        recommendedAction: 'Place emergency order for 100 units of Blue Dream',
        status: 'active',
        createdAt: new Date('2024-01-16'),
        tags: ['inventory', 'urgent', 'blue_dream']
      },
      {
        id: 'alert_1234567891',
        type: 'anomaly',
        severity: 'warning',
        title: 'Unusual Sales Pattern Detected',
        message: 'Sales volume is 35% below expected for this time of day.',
        metric: {
          id: 'sales_volume',
          name: 'Daily Sales Volume',
          value: 2345,
          unit: 'USD',
          trend: 'down',
          change: -1256,
          changePercent: -35.0,
          period: 'day',
          target: 3600,
          status: 'critical',
          lastUpdated: new Date('2024-01-16')
        },
        recommendedAction: 'Investigate cause of sales decline and adjust inventory accordingly',
        status: 'active',
        createdAt: new Date('2024-01-16'),
        tags: ['sales', 'anomaly', 'decline']
      },
      {
        id: 'alert_1234567892',
        type: 'threshold',
        severity: 'error',
        title: 'Customer Churn Rate Above Threshold',
        message: 'Monthly churn rate has exceeded 5% threshold. Immediate action required.',
        threshold: 0.05,
        currentValue: 0.087,
        recommendedAction: 'Launch emergency retention campaign and review customer service processes',
        status: 'active',
        createdAt: new Date('2024-01-16'),
        tags: ['customer', 'churn', 'critical']
      }
    ]

    const mockForecasts: Forecast[] = [
      {
        id: 'forecast_sales_weekly',
        type: 'sales',
        title: 'Weekly Sales Forecast',
        description: '7-day sales forecast with confidence intervals',
        period: 'week',
        predictions: [
          { date: new Date('2024-01-17'), value: 2340, confidence: 0.92, upperBound: 2456, lowerBound: 2224 },
          { date: new Date('2024-01-18'), value: 2456, confidence: 0.89, upperBound: 2578, lowerBound: 2334 },
          { date: new Date('2024-01-19'), value: 2678, confidence: 0.87, upperBound: 2811, lowerBound: 2545 },
          { date: new Date('2024-01-20'), value: 2890, confidence: 0.85, upperBound: 3025, lowerBound: 2755 },
          { date: new Date('2024-01-21'), value: 2901, confidence: 0.88, upperBound: 3045, lowerBound: 2757 },
          { date: new Date('2024-01-22'), value: 2845, confidence: 0.86, upperBound: 2988, lowerBound: 2702 },
          { date: new Date('2024-01-23'), value: 3123, confidence: 0.91, upperBound: 3279, lowerBound: 2967 }
        ],
        accuracy: 0.88,
        model: 'Sales Forecast LSTM',
        lastUpdated: new Date('2024-01-16'),
        status: 'active'
      },
      {
        id: 'forecast_inventory_monthly',
        type: 'inventory',
        title: 'Monthly Inventory Forecast',
        description: '30-day inventory demand forecast for top products',
        period: 'month',
        predictions: [
          { date: new Date('2024-01-17'), value: 156, confidence: 0.91, upperBound: 168, lowerBound: 144 },
          { date: new Date('2024-01-18'), value: 162, confidence: 0.89, upperBound: 173, lowerBound: 151 },
          { date: new Date('2024-01-19'), value: 145, confidence: 0.87, upperBound: 156, lowerBound: 134 },
          { date: new Date('2024-01-20'), value: 139, confidence: 0.85, upperBound: 149, lowerBound: 129 }
        ],
        accuracy: 0.87,
        model: 'Inventory Demand Prophet',
        lastUpdated: new Date('2024-01-16'),
        status: 'active'
      }
    ]

    const mockMetrics: Metric[] = [
      {
        id: 'daily_revenue',
        name: 'Daily Revenue',
        value: 15678.90,
        unit: 'USD',
        trend: 'up',
        change: 1234.56,
        changePercent: 8.5,
        period: 'day',
        target: 15000,
        status: 'behind',
        lastUpdated: new Date('2024-01-16')
      },
      {
        id: 'weekly_sales',
        name: 'Weekly Sales',
        value: 8934,
        unit: 'units',
        trend: 'up',
        change: 567,
        changePercent: 6.8,
        period: 'week',
        target: 10000,
        status: 'on_track',
        lastUpdated: new Date('2024-01-16')
      },
      {
        id: 'customer_retention',
        name: 'Customer Retention Rate',
        value: 0.87,
        unit: '%',
        trend: 'down',
        change: -0.03,
        changePercent: -3.3,
        period: 'month',
        target: 0.90,
        status: 'critical',
        lastUpdated: new Date('2024-01-16')
      },
      {
        id: 'inventory_turnover',
        name: 'Inventory Turnover',
        value: 4.2,
        unit: 'times',
        trend: 'stable',
        change: 0.1,
        changePercent: 2.4,
        period: 'month',
        target: 5.0,
        status: 'on_track',
        lastUpdated: new Date('2024-01-16')
      }
    ]

    setModels(mockModels)
    setPredictions(mockPredictions)
    setAlerts(mockAlerts)
    setForecasts(mockForecasts)
    setMetrics(mockMetrics)
  }, [])

  // Calculate prediction accuracy
  const calculateAccuracy = (prediction: Prediction): number => {
    if (!prediction.actualValue) return 0
    
    const predicted = typeof prediction.prediction === 'object' 
      ? prediction.prediction.value || prediction.prediction.current_week || 0
      : prediction.prediction
    
    const actual = prediction.actualValue
    const accuracy = 1 - Math.abs(predicted - actual) / actual
    return Math.max(0, Math.min(1, accuracy))
  }

  // Get prediction type icon
  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'sales': return <TrendingUp className="h-5 w-5" />
      case 'inventory': return <Package className="h-5 w-5" />
      case 'customer': return <Users className="h-5 w-5" />
      case 'financial': return <DollarSign className="h-5 w-5" />
      case 'operational': return <Activity className="h-5 w-5" />
      case 'market': return <Globe className="h-5 w-5" />
      default: return <Brain className="h-5 w-5" />
    }
  }

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'incorrect': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = prediction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prediction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || prediction.type === filterType
    const matchesStatus = filterStatus === 'all' || prediction.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredAlerts = alerts.filter(alert => {
    return alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics</h1>
          <p className="text-gray-600">AI-powered predictions and forecasts for business intelligence</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Train Models
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Predictions
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-gray-900">{models.filter(m => m.status === 'active').length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length * 100).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.status === 'active').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.slice(0, 5).map((prediction) => (
                    <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getImpactColor(prediction.impact)}`}>
                          {getPredictionIcon(prediction.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{prediction.title}</h3>
                          <p className="text-sm text-gray-500">{prediction.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(prediction.status)}>
                            {prediction.status}
                          </Badge>
                          <p className="text-sm text-gray-500">
                            {(prediction.confidence * 100).toFixed(1)}%
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
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.filter(a => a.status === 'active').slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg mt-1 ${getSeverityColor(alert.severity)}`}>
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          {alert.recommendedAction && (
                            <p className="text-sm text-blue-600 mt-1">
                              <strong>Action:</strong> {alert.recommendedAction}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {alert.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search predictions..."
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
                <option value="sales">Sales</option>
                <option value="inventory">Inventory</option>
                <option value="customer">Customer</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="market">Market</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="incorrect">Incorrect</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPredictions.map((prediction) => (
              <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getImpactColor(prediction.impact)}`}>
                        {getPredictionIcon(prediction.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{prediction.title}</h3>
                        <p className="text-sm text-gray-500">{prediction.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Model: {prediction.modelName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getStatusColor(prediction.status)}>
                        {prediction.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Target className="h-3 w-3 text-gray-600" />
                        <span className="text-sm text-gray-500">
                          {(prediction.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Prediction:</p>
                      <p className="font-medium">
                        {typeof prediction.prediction === 'object' 
                          ? JSON.stringify(prediction.prediction, null, 2).slice(0, 100) + '...'
                          : prediction.prediction
                        }
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeframe:</span>
                      <span className="font-medium capitalize">{prediction.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impact:</span>
                      <span className="font-medium capitalize">{prediction.impact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium">{prediction.expiresAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {prediction.actions.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</p>
                      <div className="space-y-2">
                        {prediction.actions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{action.title}</p>
                              <p className="text-xs text-gray-600">{action.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                action.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                action.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {action.priority}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {/* Execute action */}}
                              >
                                Execute
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        <Brain className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{model.type}</p>
                        <p className="text-sm text-gray-500">{model.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        model.status === 'active' ? 'bg-green-100 text-green-800' :
                        model.status === 'training' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {model.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* Retrain model */}}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Accuracy</p>
                        <p className="font-medium">{(model.accuracy * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confidence</p>
                        <p className="font-medium">{(model.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Trained</p>
                        <p className="font-medium">{model.lastTrained.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Training</p>
                        <p className="font-medium">{model.nextTraining.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {model.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.severity === 'critical' ? 'border-red-200' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        {alert.prediction && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Related Prediction:</strong> {alert.prediction.title}
                          </p>
                        )}
                        {alert.metric && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Metric:</strong> {alert.metric.name} ({alert.metric.value})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {alert.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {alert.recommendedAction && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Recommended Action</p>
                          <p className="text-sm text-gray-600">{alert.recommendedAction}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {/* Execute action */}}
                          >
                            Execute
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* Dismiss alert */}}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecasts.map((forecast) => (
              <Card key={forecast.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>{forecast.title}</span>
                    </div>
                    <Badge className={
                      forecast.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {forecast.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{forecast.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Period</p>
                      <p className="text-sm text-gray-500 capitalize">{forecast.period}</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Model</p>
                      <p className="text-sm text-gray-500">{forecast.model}</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Accuracy</p>
                      <p className="text-sm text-gray-500">{(forecast.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-gray-500">{forecast.lastUpdated.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-4 text-gray-900 mb-4">Forecast Data</div>
                    <div className="space-y-2">
                      {forecast.predictions.map((prediction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border-b">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {prediction.date.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Value: {prediction.value} (Range: {prediction.lowerBound} - {prediction.upperBound})
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-right">
                            <div className="text-right">
                              <p className="text-sm font-medium">{prediction.value}</p>
                              <p className="text-xs text-gray-500">
                                ±{((prediction.upperBound - prediction.lowerBound) / 2).toFixed(1)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                prediction.confidence > 0.8 ? 'bg-green-500' :
                                prediction.confidence > 0.6 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                              <span className="text-xs text-gray-500">
                                {(prediction.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
