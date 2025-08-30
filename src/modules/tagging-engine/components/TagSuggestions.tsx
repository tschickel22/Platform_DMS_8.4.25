import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, CheckCircle, X, Lightbulb, Target } from 'lucide-react'
import { TagSuggestion, TagType } from '../types'
import { useTagging } from '../hooks/useTagging'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TagSuggestionsProps {
  entityId: string
  entityType: TagType
  entityData: any
}

export function TagSuggestions({ entityId, entityType, entityData }: TagSuggestionsProps) {
  const {
    suggestions,
    generateTagSuggestions,
    assignTag,
    tags
  } = useTagging()

  const [loading, setLoading] = useState(false)
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([])

  const entitySuggestions = suggestions.filter(s => 
    s.entityId === entityId && s.entityType === entityType && !s.isApplied
  )

  const handleGenerateSuggestions = async () => {
    setLoading(true)
    try {
      await generateTagSuggestions(entityId, entityType, entityData)
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = async (suggestionId: string, tagId: string) => {
    try {
      await assignTag(tagId, entityId, entityType, {
        appliedFromSuggestion: suggestionId,
        appliedAt: new Date()
      })
      setAppliedSuggestions(prev => [...prev, suggestionId])
    } catch (error) {
      console.error('Failed to apply suggestion:', error)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-50 text-green-700 border-green-200'
    if (confidence >= 60) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    return 'bg-orange-50 text-orange-700 border-orange-200'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <Target className="h-3 w-3" />
    if (confidence >= 60) return <Lightbulb className="h-3 w-3" />
    return <Brain className="h-3 w-3" />
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-500" />
              AI Tag Suggestions
            </CardTitle>
            <CardDescription>
              Smart tag recommendations based on entity data
            </CardDescription>
          </div>
          <Button 
            onClick={handleGenerateSuggestions} 
            disabled={loading}
            size="sm"
          >
            <Brain className="h-4 w-4 mr-2" />
            {loading ? 'Analyzing...' : 'Generate Suggestions'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entitySuggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No suggestions available</p>
            <p className="text-sm">Click "Generate Suggestions" to get AI-powered tag recommendations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entitySuggestions.map((suggestion) => (
              <div key={suggestion.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Suggestions for {entityType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Generated {formatDate(suggestion.generatedAt)}
                  </span>
                </div>

                <div className="space-y-2">
                  {suggestion.suggestedTags.map((suggestedTag) => {
                    const tag = tags.find(t => t.id === suggestedTag.tagId)
                    if (!tag) return null

                    const isApplied = appliedSuggestions.includes(suggestion.id)

                    return (
                      <div 
                        key={suggestedTag.tagId} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{tag.name}</span>
                              <Badge className={cn("ri-badge-status text-xs", getConfidenceColor(suggestedTag.confidence))}>
                                {getConfidenceIcon(suggestedTag.confidence)}
                                <span className="ml-1">{suggestedTag.confidence}%</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {suggestedTag.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {isApplied ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Applied
                            </Badge>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApplySuggestion(suggestion.id, suggestedTag.tagId)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Apply
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}