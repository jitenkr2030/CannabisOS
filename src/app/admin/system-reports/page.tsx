'use client'

import PageTemplate from '@/components/PageTemplate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, TrendingUp, Users } from 'lucide-react'

export default function SystemReportsPage() {
  return (
    <PageTemplate
      title="System Reports"
      description="Generate and view system-wide reports and analytics"
      pageType="admin"
    >
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Monthly Revenue Report</h3>
              <p className="text-sm text-gray-600 mb-3">Complete financial overview</p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Sales Analytics</h3>
              <p className="text-sm text-gray-600 mb-3">Sales trends and forecasts</p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">User Activity Report</h3>
              <p className="text-sm text-gray-600 mb-3">User engagement metrics</p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  )
}