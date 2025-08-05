import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Star,
  Users,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ArrowLeft
} from 'lucide-react'
import { useContractorManagement } from '../hooks/useContractorManagement'
import { ContractorTrade, ContractorJobStatus, Priority } from '@/types'

// Helper function to get trade display name
const getTradeDisplayName = (trade: ContractorTrade): string => {
  const tradeNames: Record<ContractorTrade, string> = {
    [ContractorTrade.ELECTRICAL]: 'Electrical',
    [ContractorTrade.PLUMBING]: 'Plumbing',
    [ContractorTrade.SKIRTING]: 'Skirting',
    [ContractorTrade.HVAC]: 'HVAC',
    [ContractorTrade.FLOORING]: 'Flooring',
    [ContractorTrade.ROOFING]: 'Roofing',
    [ContractorTrade.GENERAL]: 'General',
    [ContractorTrade.LANDSCAPING]: 'Landscaping'
  }
  return tradeNames[trade] || trade
}

export function ContractorAnalytics() {
  const {
    contractors,
    contractorJobs,
    activeContractors,
    loading,
    error
  } = useContractorManagement()

  // Calculate analytics data
  const analytics = useMemo(() => {
    const completedJobs = contractorJobs.filter(job => job.status === ContractorJobStatus.COMPLETED)
    const pendingJobs = contractorJobs.filter(job => job.status === ContractorJobStatus.PENDING)
    const inProgressJobs = contractorJobs.filter(job => 
      job.status === ContractorJobStatus.ASSIGNED || 
      job.status === ContractorJobStatus.EN_ROUTE || 
      job.status === ContractorJobStatus.ON_SITE
    )

    // Job completion rate
    const totalJobs = contractorJobs.length
    const completionRate = totalJobs > 0 ? (completedJobs.length / totalJobs) * 100 : 0

    // Average job duration (using estimated duration as placeholder)
    const avgJobDuration = completedJobs.length > 0 
      ? completedJobs.reduce((sum, job) => sum + job.estimatedDuration, 0) / completedJobs.length
      : 0

    // Jobs by trade
    const jobsByTrade = contractorJobs.reduce((acc, job) => {
      acc[job.trade] = (acc[job.trade] || 0) + 1
      return acc
    }, {} as Record<ContractorTrade, number>)

    // Jobs by priority
    const jobsByPriority = contractorJobs.reduce((acc, job) => {
      acc[job.priority] = (acc[job.priority] || 0) + 1
      return acc
    }, {} as Record<Priority, number>)

    // Contractor performance
    const contractorPerformance = activeContractors.map(contractor => {
      const jobsForContractor = contractorJobs.filter(job => job.assignedContractorId === contractor.id)
      const completedForContractor = jobsForContractor.filter(job => job.status === ContractorJobStatus.COMPLETED)
      const completionRate = jobsForContractor.length > 0 ? (completedForContractor.length / jobsForContractor.length) * 100 : 0
      
      return {
        id: contractor.id,
        name: contractor.name,
        trade: contractor.trade,
        rating: contractor.ratings.averageRating,
        totalJobs: jobsForContractor.length,
        completedJobs: completedForContractor.length,
        completionRate,
        reviewCount: contractor.ratings.reviewCount
      }
    }).sort((a, b) => b.completionRate - a.completionRate)

    // This week's activity
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const thisWeekJobs = contractorJobs.filter(job => {
      const jobDate = new Date(job.scheduledDate)
      return jobDate >= weekStart && jobDate <= weekEnd
    })

    return {
      totalJobs,
      completedJobs: completedJobs.length,
      pendingJobs: pendingJobs.length,
      inProgressJobs: inProgressJobs.length,
      completionRate,
      avgJobDuration,
      jobsByTrade,
      jobsByPriority,
      contractorPerformance,
      thisWeekJobs: thisWeekJobs.length
    }
  }, [contractorJobs, activeContractors])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/contractors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Button>
          </Link>
          <div className="ri-page-header">
            <h1 className="ri-page-title">Contractor Analytics</h1>
            <p className="ri-page-description">
              Performance insights and analytics for your contractor network
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</div>
            <Progress value={analytics.completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.completedJobs} of {analytics.totalJobs} jobs completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Job Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgJobDuration.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Average estimated duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.inProgressJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.thisWeekJobs}</div>
            <p className="text-xs text-muted-foreground">
              Jobs scheduled
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Trade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Jobs by Trade
            </CardTitle>
            <CardDescription>
              Distribution of jobs across different trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.jobsByTrade)
                .sort(([,a], [,b]) => b - a)
                .map(([trade, count]) => {
                  const percentage = analytics.totalJobs > 0 ? (count / analytics.totalJobs) * 100 : 0
                  return (
                    <div key={trade} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {getTradeDisplayName(trade as ContractorTrade)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {count} jobs ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Jobs by Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Jobs by Priority
            </CardTitle>
            <CardDescription>
              Priority distribution of all jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.jobsByPriority)
                .sort(([,a], [,b]) => b - a)
                .map(([priority, count]) => {
                  const percentage = analytics.totalJobs > 0 ? (count / analytics.totalJobs) * 100 : 0
                  const priorityColors = {
                    [Priority.URGENT]: 'bg-red-500',
                    [Priority.HIGH]: 'bg-orange-500',
                    [Priority.MEDIUM]: 'bg-yellow-500',
                    [Priority.LOW]: 'bg-green-500'
                  }
                  return (
                    <div key={priority} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${priorityColors[priority as Priority]}`} />
                          <span className="text-sm font-medium capitalize">{priority}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} jobs ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Contractors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Top Performing Contractors
          </CardTitle>
          <CardDescription>
            Contractors ranked by completion rate and rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.contractorPerformance.slice(0, 10).map((contractor, index) => (
              <div key={contractor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{contractor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {getTradeDisplayName(contractor.trade)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{contractor.completionRate.toFixed(1)}%</div>
                    <div className="text-muted-foreground">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="font-medium">{contractor.rating}</span>
                    </div>
                    <div className="text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{contractor.totalJobs}</div>
                    <div className="text-muted-foreground">Jobs</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}