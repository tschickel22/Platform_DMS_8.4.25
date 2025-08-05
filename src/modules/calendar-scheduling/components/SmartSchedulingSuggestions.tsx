import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  Clock, 
  Users, 
  MapPin, 
  TrendingUp,
  CheckCircle,
  X,
  Calendar,
  Target,
  Zap
} from 'lucide-react'
import { CalendarEvent } from '../types'
import { useToast } from '@/hooks/use-toast'
import { formatDateTime } from '@/lib/utils'

interface SchedulingSuggestion {
  id: string
  type: 'optimal_time' | 'resource_optimization' | 'travel_optimization' | 'workload_balance' | 'customer_preference'
  title: string
  description: string
  confidence: number
  priority: 'low' | 'medium' | 'high'
  eventId?: string
  suggestedTime?: Date
  suggestedAssignee?: string
  estimatedImprovement: string
  reasoning: string[]
  actionRequired: boolean
}

interface SmartSchedulingSuggestionsProps {
  events: CalendarEvent[]
  onApplySuggestion: (suggestion: SchedulingSuggestion) => Promise<void>
  onDismissSuggestion: (suggestionId: string) => void
}

export function SmartSchedulingSuggestions({ 
  events, 
  onApplySuggestion, 
  onDismissSuggestion 
}: SmartSchedulingSuggestionsProps) {
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    generateSmartSuggestions()
  }, [events])

  const generateSmartSuggestions = async () => {
    setLoading(true)
    try {
      // Simulate AI analysis for smart suggestions
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockSuggestions: SchedulingSuggestion[] = [
        {
          id: 'smart-1',
          type: 'optimal_time',
          title: 'Optimal Time Slot Available',
          description: 'Tuesday 2:00 PM shows 23% higher completion rates for service appointments',
          confidence: 89,
          priority: 'high',
          eventId: 'service-001',
          suggestedTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
          estimatedImprovement: '23% higher success rate',
          reasoning: [
            'Historical data shows Tuesday afternoons have highest completion rates',
            'Team availability is optimal during this time slot',
            'Customer response rates are 15% higher on Tuesdays'
          ],
          actionRequired: true
        },
        {
          id: 'smart-2',
          type: 'travel_optimization',
          title: 'Route Optimization Opportunity',
          description: 'Grouping 3 deliveries in the same area could save 90 minutes of travel time',
          confidence: 94,
          priority: 'high',
          estimatedImprovement: '90 minutes saved',
          reasoning: [
            'All deliveries are within 5-mile radius',
            'Current schedule has inefficient routing',
            'Consolidation maintains customer preferences'
          ],
          actionRequired: true
        },
        {
          id: 'smart-3',
          type: 'workload_balance',
          title: 'Workload Rebalancing Recommended',
          description: 'Sarah Johnson has 40% more capacity than current assignment suggests',
          confidence: 76,
          priority: 'medium',
          suggestedAssignee: 'sarah-johnson',
          estimatedImprovement: '15% faster completion',
          reasoning: [
            'Sarah has consistently faster completion times',
            'Current workload is below optimal capacity',
            'Specialization match with pending tasks'
          ],
          actionRequired: false
        },
        {
          id: 'smart-4',
          type: 'customer_preference',
          title: 'Customer Preference Pattern Detected',
          description: 'This customer historically prefers morning appointments (85% acceptance rate)',
          confidence: 82,
          priority: 'medium',
          eventId: 'service-002',
          suggestedTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
          estimatedImprovement: '85% acceptance rate',
          reasoning: [
            'Customer has accepted 85% of morning appointments',
            'Only 45% acceptance rate for afternoon slots',
            'Consistent pattern over 12 months'
          ],
          actionRequired: false
        },
        {
          id: 'smart-5',
          type: 'resource_optimization',
          title: 'Equipment Scheduling Conflict',
          description: 'Specialized diagnostic equipment is double-booked next Thursday',
          confidence: 100,
          priority: 'high',
          estimatedImprovement: 'Prevent scheduling conflict',
          reasoning: [
            'Equipment required for both appointments',
            'Only one unit available',
            'Rescheduling one appointment prevents delays'
          ],
          actionRequired: true
        }
      ]

      setSuggestions(mockSuggestions)
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Failed to generate smart suggestions',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = async (suggestion: SchedulingSuggestion) => {
    try {
      await onApplySuggestion(suggestion)
      
      // Remove applied suggestion
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
      
      toast({
        title: 'Suggestion Applied',
        description: suggestion.title,
      })
    } catch (error) {
      toast({
        title: 'Application Failed',
        description: 'Failed to apply suggestion',
        variant: 'destructive'
      })
    }
  }

  const handleDismiss = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    onDismissSuggestion(suggestionId)
  }

  const filteredSuggestions = suggestions.filter(suggestion => 
    filter === 'all' || suggestion.priority === filter
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case 'optimal_time':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resource_optimization':
        return <Target className="h-4 w-4 text-purple-500" />
      case 'travel_optimization':
        return <MapPin className="h-4 w-4 text-green-500" />
      case 'workload_balance':
        return <Users className="h-4 w-4 text-orange-500" />
      case 'customer_preference':
        return <TrendingUp className="h-4 w-4 text-pink-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Smart Suggestions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-primary" />
            Smart Scheduling Suggestions
          </h2>
          <p className="text-muted-foreground">
            AI-powered recommendations for optimal scheduling
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <Button variant="outline" onClick={generateSmartSuggestions} disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Refresh Suggestions
          </Button>
        </div>
      </div>

      {/* Suggestions Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Suggestions</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{suggestions.length}</div>
            <p className="text-xs text-blue-600">AI recommendations</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">High Priority</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {suggestions.filter(s => s.priority === 'high').length}
            </div>
            <p className="text-xs text-red-600">Immediate attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Action Required</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {suggestions.filter(s => s.actionRequired).length}
            </div>
            <p className="text-xs text-green-600">Need decisions</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {suggestions.length > 0 ? Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length) : 0}%
            </div>
            <p className="text-xs text-purple-600">AI confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Active Suggestions</CardTitle>
          <CardDescription>
            Review and apply AI-generated scheduling recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing scheduling patterns...</p>
              </div>
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <div className="space-y-4">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(suggestion.type)}
                        <h4 className="font-semibold">{suggestion.title}</h4>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {suggestion.confidence}% confidence
                        </Badge>
                        {suggestion.actionRequired && (
                          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                            ACTION REQUIRED
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>
                      
                      <div className="mb-3">
                        <span className="text-sm font-medium text-green-600">
                          Expected improvement: {suggestion.estimatedImprovement}
                        </span>
                      </div>
                      
                      {/* Reasoning */}
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h5 className="text-sm font-medium mb-2">AI Reasoning:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {suggestion.reasoning.map((reason, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Suggested Changes */}
                      {(suggestion.suggestedTime || suggestion.suggestedAssignee) && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <h5 className="text-sm font-medium text-blue-900 mb-2">Suggested Changes:</h5>
                          <div className="space-y-1 text-sm text-blue-800">
                            {suggestion.suggestedTime && (
                              <p>• Reschedule to: {formatDateTime(suggestion.suggestedTime)}</p>
                            )}
                            {suggestion.suggestedAssignee && (
                              <p>• Reassign to: {suggestion.suggestedAssignee}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                        disabled={!suggestion.actionRequired}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDismiss(suggestion.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No suggestions available</p>
              <p className="text-sm">
                {filter !== 'all' 
                  ? `No ${filter} priority suggestions found`
                  : 'Your schedule is optimally organized!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Insights */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>AI Learning Insights</CardTitle>
          <CardDescription>
            How the AI is learning from your scheduling patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Pattern Recognition</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service appointments:</span>
                  <span className="font-medium">Tuesday-Thursday optimal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery windows:</span>
                  <span className="font-medium">Morning preferred (78%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team efficiency:</span>
                  <span className="font-medium">Peak at 10 AM - 2 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer response:</span>
                  <span className="font-medium">Best on weekdays</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Learning Progress</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time Optimization</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resource Allocation</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer Preferences</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}