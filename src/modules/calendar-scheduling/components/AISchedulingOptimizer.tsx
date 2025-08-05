import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { formatDateTime } from '@/lib/utils'

interface OptimizationSuggestion {
  id: string
  type: 'reschedule' | 'redistribute' | 'consolidate' | 'buffer_time' | 'resource_conflict'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  affectedEvents: string[]
  suggestedActions: OptimizationAction[]
  estimatedTimeSaving: number // minutes
  estimatedEfficiencyGain: number // percentage
}

interface OptimizationAction {
  type: 'move_event' | 'reassign' | 'split_event' | 'add_buffer' | 'merge_events'
  eventId: string
  newTime?: Date
  newAssignee?: string
  bufferMinutes?: number
  targetEventId?: string
}

interface AISchedulingOptimizerProps {
  events: CalendarEvent[]
  onApplyOptimization: (suggestion: OptimizationSuggestion) => Promise<void>
  onOptimizeSchedule: () => Promise<OptimizationSuggestion[]>
}

export function AISchedulingOptimizer({ 
  events, 
  onApplyOptimization, 
  onOptimizeSchedule 
}: AISchedulingOptimizerProps) {
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false)
  const [optimizationMode, setOptimizationMode] = useState<'efficiency' | 'workload' | 'time_savings'>('efficiency')
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null)

  useEffect(() => {
    generateOptimizationSuggestions()
  }, [events, optimizationMode])

  const generateOptimizationSuggestions = async () => {
    setLoading(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockSuggestions: OptimizationSuggestion[] = [
        {
          id: 'opt-1',
          type: 'reschedule',
          title: 'Optimize Service Appointment Timing',
          description: 'Moving 3 service appointments to Tuesday-Wednesday could improve completion rates by 15%',
          confidence: 87,
          impact: 'high',
          affectedEvents: ['service-001', 'service-002', 'service-003'],
          suggestedActions: [
            {
              type: 'move_event',
              eventId: 'service-001',
              newTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            }
          ],
          estimatedTimeSaving: 120,
          estimatedEfficiencyGain: 15
        },
        {
          id: 'opt-2',
          type: 'redistribute',
          title: 'Balance Workload Distribution',
          description: 'Reassigning 2 tasks from overloaded team member to available resources',
          confidence: 92,
          impact: 'medium',
          affectedEvents: ['task-001', 'task-002'],
          suggestedActions: [
            {
              type: 'reassign',
              eventId: 'task-001',
              newAssignee: 'rep-002'
            }
          ],
          estimatedTimeSaving: 60,
          estimatedEfficiencyGain: 12
        },
        {
          id: 'opt-3',
          type: 'buffer_time',
          title: 'Add Buffer Time for Complex Tasks',
          description: 'Adding 30-minute buffers to PDI inspections to reduce schedule conflicts',
          confidence: 78,
          impact: 'medium',
          affectedEvents: ['pdi-001', 'pdi-002'],
          suggestedActions: [
            {
              type: 'add_buffer',
              eventId: 'pdi-001',
              bufferMinutes: 30
            }
          ],
          estimatedTimeSaving: 45,
          estimatedEfficiencyGain: 8
        },
        {
          id: 'opt-4',
          type: 'consolidate',
          title: 'Consolidate Delivery Routes',
          description: 'Grouping deliveries by geographic area could save 2 hours of travel time',
          confidence: 85,
          impact: 'high',
          affectedEvents: ['delivery-001', 'delivery-002', 'delivery-003'],
          suggestedActions: [
            {
              type: 'move_event',
              eventId: 'delivery-002',
              newTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
          ],
          estimatedTimeSaving: 120,
          estimatedEfficiencyGain: 18
        }
      ]

      setSuggestions(mockSuggestions)
    } catch (error) {
      toast({
        title: 'Optimization Failed',
        description: 'Failed to generate optimization suggestions',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = async (suggestion: OptimizationSuggestion) => {
    try {
      await onApplyOptimization(suggestion)
      
      // Remove applied suggestion
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
      
      toast({
        title: 'Optimization Applied',
        description: `${suggestion.title} has been applied successfully`,
      })
    } catch (error) {
      toast({
        title: 'Optimization Failed',
        description: 'Failed to apply optimization',
        variant: 'destructive'
      })
    }
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    toast({
      title: 'Suggestion Dismissed',
      description: 'Optimization suggestion has been dismissed',
    })
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reschedule':
        return <Calendar className="h-4 w-4" />
      case 'redistribute':
        return <Users className="h-4 w-4" />
      case 'consolidate':
        return <Target className="h-4 w-4" />
      case 'buffer_time':
        return <Clock className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const totalTimeSavings = suggestions.reduce((sum, s) => sum + s.estimatedTimeSaving, 0)
  const avgEfficiencyGain = suggestions.length > 0 
    ? suggestions.reduce((sum, s) => sum + s.estimatedEfficiencyGain, 0) / suggestions.length 
    : 0

  return (
    <div className="space-y-6">
      {/* AI Optimizer Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 text-primary" />
            AI Scheduling Optimizer
          </h2>
          <p className="text-muted-foreground">
            Intelligent recommendations to optimize your schedule
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={optimizationMode} onValueChange={(value: any) => setOptimizationMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efficiency">Efficiency</SelectItem>
              <SelectItem value="workload">Workload Balance</SelectItem>
              <SelectItem value="time_savings">Time Savings</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateOptimizationSuggestions} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Analyze Schedule
          </Button>
        </div>
      </div>

      {/* Optimization Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{suggestions.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <Brain className="h-3 w-3 mr-1" />
              AI recommendations
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Time Savings</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{Math.round(totalTimeSavings / 60)}h</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Potential savings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Efficiency Gain</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{Math.round(avgEfficiencyGain)}%</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Target className="h-3 w-3 mr-1" />
              Average improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Optimization Suggestions</CardTitle>
              <CardDescription>
                AI-powered recommendations to improve your schedule
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={autoOptimizeEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                Auto-optimize: {autoOptimizeEnabled ? 'ON' : 'OFF'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAutoOptimizeEnabled(!autoOptimizeEnabled)}
              >
                {autoOptimizeEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Analyzing schedule patterns...</p>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(suggestion.type)}
                        <h4 className="font-semibold">{suggestion.title}</h4>
                        <Badge className={getImpactColor(suggestion.impact)}>
                          {suggestion.impact.toUpperCase()} IMPACT
                        </Badge>
                        <Badge variant="outline">
                          {suggestion.confidence}% confidence
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Time Savings</p>
                          <p className="font-medium">{Math.round(suggestion.estimatedTimeSaving / 60)}h {suggestion.estimatedTimeSaving % 60}m</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Efficiency Gain</p>
                          <p className="font-medium">{suggestion.estimatedEfficiencyGain}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Affected Events</p>
                          <p className="font-medium">{suggestion.affectedEvents.length}</p>
                        </div>
                      </div>
                      
                      {/* Suggested Actions Preview */}
                      <div className="mt-3 p-3 bg-muted/30 rounded-md">
                        <h5 className="text-sm font-medium mb-2">Suggested Actions:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {suggestion.suggestedActions.slice(0, 3).map((action, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              <span>
                                {action.type === 'move_event' && `Move event to ${action.newTime ? formatDateTime(action.newTime) : 'optimal time'}`}
                                {action.type === 'reassign' && `Reassign to ${action.newAssignee || 'available team member'}`}
                                {action.type === 'add_buffer' && `Add ${action.bufferMinutes || 30} minute buffer`}
                                {action.type === 'merge_events' && 'Consolidate with related event'}
                              </span>
                            </li>
                          ))}
                          {suggestion.suggestedActions.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{suggestion.suggestedActions.length - 3} more actions
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDismissSuggestion(suggestion.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No optimization suggestions available</p>
              <p className="text-sm">Your schedule is already well-optimized!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimization Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Optimization Settings
          </CardTitle>
          <CardDescription>
            Configure how the AI optimizer analyzes your schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Optimization Priority</label>
              <Select value={optimizationMode} onValueChange={(value: any) => setOptimizationMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efficiency">Maximize Efficiency</SelectItem>
                  <SelectItem value="workload">Balance Workload</SelectItem>
                  <SelectItem value="time_savings">Minimize Travel Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Auto-Apply Threshold</label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Confidence Only (80%+)</SelectItem>
                  <SelectItem value="medium">Medium Confidence (60%+)</SelectItem>
                  <SelectItem value="low">All Suggestions (40%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Optimization Factors</h4>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Consider travel time between locations</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Respect team member preferences</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Maintain customer-requested times</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Consider historical completion rates</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">AI Learning Status</span>
            </div>
            <p className="text-sm text-blue-800">
              The AI has analyzed {events.length} events and is continuously learning from your scheduling patterns.
              Confidence in recommendations improves over time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Suggestion Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    {getTypeIcon(selectedSuggestion.type)}
                    <span className="ml-2">{selectedSuggestion.title}</span>
                  </CardTitle>
                  <CardDescription>
                    Detailed optimization recommendation
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSuggestion(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getImpactColor(selectedSuggestion.impact)}>
                  {selectedSuggestion.impact.toUpperCase()} IMPACT
                </Badge>
                <Badge variant="outline">
                  {selectedSuggestion.confidence}% confidence
                </Badge>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  {Math.round(selectedSuggestion.estimatedTimeSaving / 60)}h {selectedSuggestion.estimatedTimeSaving % 60}m savings
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSuggestion.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Detailed Actions</h4>
                <div className="space-y-3">
                  {selectedSuggestion.suggestedActions.map((action, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {action.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">Event: {action.eventId}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.type === 'move_event' && action.newTime && 
                          `Reschedule to ${formatDateTime(action.newTime)}`}
                        {action.type === 'reassign' && 
                          `Reassign to ${action.newAssignee}`}
                        {action.type === 'add_buffer' && 
                          `Add ${action.bufferMinutes} minute buffer time`}
                        {action.type === 'merge_events' && 
                          `Consolidate with event ${action.targetEventId}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedSuggestion(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleApplySuggestion(selectedSuggestion)
                  setSelectedSuggestion(null)
                }}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Optimization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
