'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  Settings, 
  Calendar, 
  FileText, 
  Play, 
  Video, 
  Download, 
  ExternalLink, 
  Plus, 
  Edit, 
  Eye,
  RefreshCw,
  Zap,
  Target,
  Award,
  BookOpen,
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Shield,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  CheckSquare,
  Square,
  List,
  Layers
} from 'lucide-react'
import { db } from '@/lib/db'

interface Partner {
  id: string
  companyName: string
  contactName: string
  email: string
  onboardingStatus: string
  partnerSince: string
}

interface OnboardingTask {
  id: string
  partnerId: string
  title: string
  description?: string
  status: string
  priority: string
  assignedTo?: string
  dueDate: string
  completedDate?: string
  category: string
  resources?: string
  createdAt: string
  updatedAt: string
}

interface SupportTicket {
  id: string
  partnerId?: string
  subject: string
  description: string
  priority: string
  status: string
  category: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolution?: string
}

interface OnboardingSystemProps {
  partner: Partner
  tasks: OnboardingTask[]
  onTaskUpdated: () => void
}

export default function OnboardingSystem({ partner, tasks, onTaskUpdated }: OnboardingSystemProps) {
  const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'SETUP',
    dueDate: '',
    assignedTo: '',
    resources: ''
  })

  const [ticketFormData, setTicketFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL'
  })

  useEffect(() => {
    loadSupportTickets()
  }, [partner.id])

  const loadSupportTickets = async () => {
    try {
      const tickets = await db.supportTicket.findMany({
        where: { partnerId: partner.id },
        orderBy: { createdAt: 'desc' }
      })
      setSupportTickets(tickets)
    } catch (error) {
      console.error('Error loading support tickets:', error)
    }
  }

  const handleCreateTask = async () => {
    try {
      setIsLoading(true)
      
      const newTask = await db.onboardingTask.create({
        data: {
          partnerId: partner.id,
          title: taskFormData.title,
          description: taskFormData.description,
          priority: taskFormData.priority,
          category: taskFormData.category,
          dueDate: taskFormData.dueDate,
          assignedTo: taskFormData.assignedTo,
          resources: taskFormData.resources,
          status: 'NOT_STARTED'
        }
      })

      setTaskFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'SETUP',
        dueDate: '',
        assignedTo: '',
        resources: ''
      })

      setIsCreateTaskDialogOpen(false)
      onTaskUpdated()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTask = async (taskId: string, status: string) => {
    try {
      const updateData: any = { status }
      if (status === 'COMPLETED') {
        updateData.completedDate = new Date().toISOString()
      }

      await db.onboardingTask.update({
        where: { id: taskId },
        data: updateData
      })

      onTaskUpdated()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleCreateTicket = async () => {
    try {
      setIsLoading(true)
      
      const newTicket = await db.supportTicket.create({
        data: {
          partnerId: partner.id,
          subject: ticketFormData.subject,
          description: ticketFormData.description,
          priority: ticketFormData.priority,
          category: ticketFormData.category,
          status: 'OPEN'
        }
      })

      setTicketFormData({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        category: 'GENERAL'
      })

      setIsTicketDialogOpen(false)
      loadSupportTickets()
    } catch (error) {
      console.error('Error creating ticket:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTicket = async (ticketId: string, status: string, resolution?: string) => {
    try {
      const updateData: any = { status }
      if (status === 'RESOLVED') {
        updateData.resolvedAt = new Date().toISOString()
        updateData.resolution = resolution
      }

      await db.supportTicket.update({
        where: { id: ticketId },
        data: updateData
      })

      loadSupportTickets()
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800'
      case 'BLOCKED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SETUP': return <Settings className="h-4 w-4" />
      case 'TRAINING': return <BookOpen className="h-4 w-4" />
      case 'CUSTOMIZATION': return <Palette className="h-4 w-4" />
      case 'LAUNCH': return <Rocket className="h-4 w-4" />
      case 'MARKETING': return <Target className="h-4 w-4" />
      case 'TECHNICAL': return <Monitor className="h-4 w-4" />
      case 'BILLING': return <CreditCard className="h-4 w-4" />
      case 'SUPPORT': return <Headphones className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />
      case 'NOT_STARTED': return <Square className="h-4 w-4" />
      case 'BLOCKED': return <AlertTriangle className="h-4 w-4" />
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const calculateProgress = () => {
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length
    return tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0
  }

  const getOnboardingStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'BLOCKED': return 'bg-red-100 text-red-800'
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800'
      case 'NEEDS_ATTENTION': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const openResource = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Onboarding System</h2>
          <p className="text-gray-600">Track your onboarding progress and get support</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={getOnboardingStatusColor(partner.onboardingStatus)}>
            {partner.onboardingStatus.replace('_', ' ')}
          </Badge>
          <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select value={taskFormData.priority} onValueChange={(value) => setTaskFormData({ ...taskFormData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="task-category">Category</Label>
                    <Select value={taskFormData.category} onValueChange={(value) => setTaskFormData({ ...taskFormData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SETUP">Setup</SelectItem>
                        <SelectItem value="TRAINING">Training</SelectItem>
                        <SelectItem value="CUSTOMIZATION">Customization</SelectItem>
                        <SelectItem value="LAUNCH">Launch</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="TECHNICAL">Technical</SelectItem>
                        <SelectItem value="BILLING">Billing</SelectItem>
                        <SelectItem value="SUPPORT">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="task-due-date">Due Date</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold">{calculateProgress().toFixed(0)}%</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'COMPLETED').length}
                </div>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </div>
                <p className="text-xs text-gray-600">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'NOT_STARTED').length}
                </div>
                <p className="text-xs text-gray-600">Not Started</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => t.status === 'BLOCKED').length}
                </div>
                <p className="text-xs text-gray-600">Blocked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getCategoryIcon(task.category)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-600">{task.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {task.status === 'NOT_STARTED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateTask(task.id, 'IN_PROGRESS')}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateTask(task.id, 'COMPLETED')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Support Tickets
            <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Support Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-subject">Subject</Label>
                    <Input
                      id="ticket-subject"
                      value={ticketFormData.subject}
                      onChange={(e) => setTicketFormData({ ...ticketFormData, subject: e.target.value })}
                      placeholder="Enter ticket subject"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticket-description">Description</Label>
                    <Textarea
                      id="ticket-description"
                      value={ticketFormData.description}
                      onChange={(e) => setTicketFormData({ ...ticketFormData, description: e.target.value })}
                      placeholder="Describe your issue"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ticket-priority">Priority</Label>
                      <Select value={ticketFormData.priority} onValueChange={(value) => setTicketFormData({ ...ticketFormData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ticket-category">Category</Label>
                      <Select value={ticketFormData.category} onValueChange={(value) => setTicketFormData({ ...ticketFormData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="TECHNICAL">Technical</SelectItem>
                          <SelectItem value="BILLING">Billing</SelectItem>
                          <SelectItem value="ACCOUNT">Account</SelectItem>
                          <SelectItem value="ONBOARDING">Onboarding</SelectItem>
                          <SelectItem value="MARKETING">Marketing</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTicket} disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Ticket'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm">{ticket.subject}</h4>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline">
                      {ticket.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500">
                      Created {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.resolvedAt && (
                      <span className="text-xs text-green-600">
                        Resolved {new Date(ticket.resolvedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  {ticket.status === 'OPEN' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateTicket(ticket.id, 'RESOLVED')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask && isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedTask.status)}
                  <span className="text-sm">{selectedTask.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <div className="flex items-center space-x-2 mt-1">
                  {getCategoryIcon(selectedTask.category)}
                  <span className="text-sm">{selectedTask.category}</span>
                </div>
              </div>
              <div>
                <Label>Priority</Label>
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </p>
              </div>
              {selectedTask.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{selectedTask.description}</p>
                </div>
              )}
              {selectedTask.resources && (
                <div>
                  <Label>Resources</Label>
                  <div className="space-y-2">
                    {JSON.parse(selectedTask.resources).map((resource: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => openResource(resource.url)}
                        className="w-full justify-start"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {resource.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
