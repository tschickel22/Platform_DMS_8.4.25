import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ListTodo } from 'lucide-react'

export default function TaskCenter() {
  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h1 className="ri-page-title">Task Center</h1>
        <p className="ri-page-description">
          Manage tasks and workflow automation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Task Management
          </CardTitle>
          <CardDescription>
            Task center features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Task center module is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}