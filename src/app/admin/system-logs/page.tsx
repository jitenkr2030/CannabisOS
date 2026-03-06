'use client'

import PageTemplate from '@/components/PageTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Activity, Clock, AlertCircle } from 'lucide-react'

export default function SystemLogsPage() {
  return (
    <PageTemplate
      title="System Logs"
      description="View and monitor system logs and activities"
      pageType="admin"
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-green-600">[INFO]</span> System backup completed successfully
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-blue-600">[DEBUG]</span> User authentication: admin@cannabisos.com
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-yellow-600">[WARN]</span> High memory usage detected
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <span className="text-red-600">[ERROR]</span> Database connection timeout
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  )
}