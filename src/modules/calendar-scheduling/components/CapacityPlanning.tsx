import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Calendar,
  Zap,
  Lightbulb
} from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface TeamMember {
  id: string
  name: string
  role: string
  capacity: number // hours per week
  currentLoad: number // hours scheduled
  efficiency: number // completion rate percentage
  specialties: string[]
}

interface CapacityPlanningProps {
  events: CalendarEvent[]
  teamMembers: TeamMember[]
  onOptimizeCapacity: () => Promise<void>
  onRebalanceWorkload: (recommendations: any[]) => Promise<void>
}

export function CapacityPlanning({ 
  events, 
  teamMembers: propTeamMembers, 
  onOptimizeCapacity, 
  onRebalanceWorkload 
}: CapacityPlanningProps) {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState('week')
  const [loading, setLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string>('all')

  // Mock team members if not provided
  const teamMembers = propTeamMembers.length > 0 ? propTeamMembers : [
    {
      id: 'tm-001',
      name: 'John Smith',
      role: 'Service Technician',
      capacity: 40,
      currentLoad: 35,
      efficiency: 87,
      specialties: ['HVAC', 'Electrical']
    },
    {
      id: 'tm-002',
      name: 'Sarah Johnson',
      role: 'Delivery Coordinator',
      capacity: 40,
      currentLoad: 28,
      efficiency: 94,
      specialties: ['Logistics', 'Customer Service']
    },
    {
      id: 'tm-003',
      name: 'Mike Davis',
      role: 'PDI Inspector',
      capacity: 40,
      currentLoad: 42,
      efficiency: 78,
      specialties: ['Quality Control', 'Documentation']
    },
    {
      id: 'tm-004',
      name: 'Lisa Chen',
      role: 'Service Manager',
      capacity: 40,
      currentLoad: 38,
      efficiency: 91,
      specialties: ['Management', 'Customer Relations']
    }
  ]

  // Calculate capacity metrics
  const capacityMetrics = useMemo(() => {
    const totalCapacity = teamMembers.reduce((sum, member) => sum + member.capacity, 0)
    const totalLoad = teamMembers.reduce((sum, member) => sum + member.currentLoad, 0)
    const utilizationRate = totalCapacity > 0 ? (totalLoad / totalCapacity) * 100 : 0
    
    const overloadedMembers = teamMembers.filter(member => 
      (member.currentLoad / member.capacity) > 0.9
    )
    
    const underutilizedMembers = teamMembers.filter(member => 
      (member.currentLoad / member.capacity) < 0.7
    )
    
    const avgEfficiency = teamMembers.length > 0 
      ? teamMembers.reduce((sum, member) => sum + member.efficiency, 0) / teamMembers.length 
      : 0

    // Weekly capacity forecast
    const weeklyForecast = Array.from({ length: 4 }, (_, weekIndex) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() + (weekIndex * 7))
      
      return {
        week: `Week ${weekIndex + 1}`,
        capacity: totalCapacity,
        projected: Math.max(totalLoad + (Math.random() - 0.5) * 10, 0),
        utilization: Math.min(((totalLoad + (Math.random() - 0.5) * 10) / totalCapacity) * 100, 100)
      }
    })

    return {
      totalCapacity,
      totalLoad,
      utilizationRate,
      overloadedMembers,
      underutilizedMembers,
      avgEfficiency,
      weeklyForecast
    }
  }, [teamMembers])

  const handleOptimizeCapacity = async () => {
    setLoading(true)
    try {
      await onOptimizeCapacity()
      toast({
        title: 'Capacity Optimized',
        description: 'Team capacity has been optimized based on current workload',
      })
    } catch (error) {
      toast({
        title: 'Optimization Failed',
        description: 'Failed to optimize capacity',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRebalanceWorkload = async () => {
    const recommendations = capacityMetrics.overloadedMembers.map(member => ({
      fromMember: member.id,
      toMembers: capacityMetrics.underutilizedMembers.map(um => um.id),
      tasksToMove: Math.ceil((member.currentLoad - member.capacity * 0.85) / 2)
    }))

    if (recommendations.length === 0) {
      toast({
        title: 'No Rebalancing Needed',
        description: 'Team workload is already well balanced',
      })
      return
    }

    setLoading(true)
    try {
      await onRebalanceWorkload(recommendations)
      toast({
        title: 'Workload Rebalanced',
        description: `Redistributed tasks for ${recommendations.length} team members`,
      })
    } catch (error) {
      toast({
        title: 'Rebalancing Failed',
        description: 'Failed to rebalance workload',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-red-600'
    if (utilization > 80) return 'text-yellow-600'
    if (utilization < 70) return 'text-blue-600'
    return 'text-green-600'
  }

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization > 90) return 'bg-red-500'
    if (utilization > 80) return 'bg-yellow-500'
    if (utilization < 70) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      {/* Capacity Planning Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Capacity Planning</h2>
          <p className="text-muted-foreground">
            Analyze and optimize team capacity and workload distribution
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleOptimizeCapacity} disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Optimize
          </Button>
        </div>
      </div>

      {/* Capacity Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{capacityMetrics.totalCapacity}h</div>
            <p className="text-xs text-blue-600">Weekly team capacity</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Current Load</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{capacityMetrics.totalLoad}h</div>
            <p className="text-xs text-green-600">Currently scheduled</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(capacityMetrics.utilizationRate)}`}>
              {Math.round(capacityMetrics.utilizationRate)}%
            </div>
            <p className="text-xs text-purple-600">Team utilization</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{Math.round(capacityMetrics.avgEfficiency)}%</div>
            <p className="text-xs text-orange-600">Average efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Member Capacity */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Member Capacity</CardTitle>
              <CardDescription>
                Individual capacity and workload analysis
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleRebalanceWorkload} disabled={loading}>
              <Users className="h-4 w-4 mr-2" />
              Rebalance Workload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const utilization = (member.currentLoad / member.capacity) * 100
              const isOverloaded = utilization > 90
              const isUnderutilized = utilization < 70
              
              return (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        isOverloaded ? 'bg-red-50 text-red-700 border-red-200' :
                        isUnderutilized ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }>
                        {Math.round(utilization)}% utilized
                      </Badge>
                      <Badge variant="outline">
                        {member.efficiency}% efficiency
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Workload: {member.currentLoad}h / {member.capacity}h</span>
                      <span className={getUtilizationColor(utilization)}>
                        {Math.round(utilization)}%
                      </span>
                    </div>
                    <Progress 
                      value={utilization} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Available: {member.capacity - member.currentLoad}h</span>
                      <span>
                        {isOverloaded ? 'Overloaded' : 
                         isUnderutilized ? 'Underutilized' : 'Optimal'}
                      </span>
                    </div>
                  </div>
                  
                  {member.specialties.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Capacity Forecast */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Capacity Forecast</CardTitle>
          <CardDescription>
            Projected capacity utilization for the next 4 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={capacityMetrics.weeklyForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="capacity" 
                  stroke="#6b7280" 
                  strokeDasharray="5 5"
                  name="Total Capacity"
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Projected Load"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Alerts */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Capacity Alerts</CardTitle>
          <CardDescription>
            Warnings and recommendations for capacity management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {capacityMetrics.overloadedMembers.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Overloaded Team Members</h4>
                    <p className="text-sm text-red-700 mt-1">
                      {capacityMetrics.overloadedMembers.length} team member(s) are over 90% capacity:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      {capacityMetrics.overloadedMembers.map(member => (
                        <li key={member.id}>
                          • {member.name}: {Math.round((member.currentLoad / member.capacity) * 100)}% utilized
                        </li>
                      ))}
                    </ul>
                    <Button size="sm" className="mt-3" onClick={handleRebalanceWorkload}>
                      Rebalance Workload
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {capacityMetrics.underutilizedMembers.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Available Capacity</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {capacityMetrics.underutilizedMembers.length} team member(s) have available capacity:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      {capacityMetrics.underutilizedMembers.map(member => (
                        <li key={member.id}>
                          • {member.name}: {member.capacity - member.currentLoad}h available
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {capacityMetrics.utilizationRate > 85 && capacityMetrics.utilizationRate <= 90 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">High Utilization Warning</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Team utilization is at {Math.round(capacityMetrics.utilizationRate)}%. 
                      Consider adding buffer time or additional resources for peak periods.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {capacityMetrics.overloadedMembers.length === 0 && 
             capacityMetrics.underutilizedMembers.length === 0 && 
             capacityMetrics.utilizationRate <= 85 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Optimal Capacity</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Team capacity is well balanced with {Math.round(capacityMetrics.utilizationRate)}% utilization. 
                      No immediate action required.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Team Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Utilization by Team Member</CardTitle>
            <CardDescription>
              Individual capacity utilization rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamMembers.map(member => ({
                  name: member.name.split(' ')[0],
                  utilization: (member.currentLoad / member.capacity) * 100,
                  efficiency: member.efficiency
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Efficiency Trends</CardTitle>
            <CardDescription>
              Team member efficiency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamMembers.map(member => ({
                  name: member.name.split(' ')[0],
                  efficiency: member.efficiency
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Recommendations */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>
            Smart suggestions for capacity optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Cross-Training Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Training Sarah Johnson in PDI processes could provide 20% more flexibility during peak periods.
                  </p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-300">
                    Strategic Recommendation
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Optimal Scheduling Window</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Scheduling complex tasks between 10 AM - 2 PM could improve completion rates by 18%.
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-300">
                    Immediate Opportunity
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900">Seasonal Capacity Planning</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Consider hiring temporary staff for Q2 peak season based on historical demand patterns.
                  </p>
                  <Badge className="mt-2 bg-purple-100 text-purple-800 border-purple-300">
                    Long-term Planning
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}