import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Save } from 'lucide-react'

interface SearchCriteria {
  field: string
  operator: string
  value: string
}

interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria[]) => void
  onClear: () => void
  entityType: 'accounts' | 'contacts' | 'leads'
  className?: string
}

export function AdvancedSearch({
  onSearch,
  onClear,
  entityType,
  className = ""
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [criteria, setCriteria] = useState<SearchCriteria[]>([
    { field: '', operator: 'contains', value: '' }
  ])

  const fieldOptions = entityType === 'accounts' 
    ? [
        { value: 'name', label: 'Account Name' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'industry', label: 'Industry' },
        { value: 'address', label: 'Address' },
        { value: 'website', label: 'Website' }
      ]
    : entityType === 'contacts'
    ? [
        { value: 'firstName', label: 'First Name' },
        { value: 'lastName', label: 'Last Name' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'title', label: 'Title' },
        { value: 'department', label: 'Department' },
        { value: 'tags', label: 'Tags' }
      ]
    : [
        { value: 'firstName', label: 'First Name' },
        { value: 'lastName', label: 'Last Name' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'source', label: 'Source' },
        { value: 'status', label: 'Status' },
        { value: 'notes', label: 'Notes' }
      ]

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' }
  ]

  const addCriteria = () => {
    setCriteria([...criteria, { field: '', operator: 'contains', value: '' }])
  }

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index))
  }

  const updateCriteria = (index: number, updates: Partial<SearchCriteria>) => {
    setCriteria(criteria.map((c, i) => i === index ? { ...c, ...updates } : c))
  }

  const handleSearch = () => {
    const validCriteria = criteria.filter(c => c.field && c.value)
    onSearch(validCriteria)
    setIsOpen(false)
  }

  const handleClear = () => {
    setCriteria([{ field: '', operator: 'contains', value: '' }])
    onClear()
    setIsOpen(false)
  }

  const activeCriteriaCount = criteria.filter(c => c.field && c.value).length

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
            {activeCriteriaCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeCriteriaCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              {criteria.map((criterion, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Label className="text-xs">Field</Label>
                    <Select 
                      value={criterion.field} 
                      onValueChange={(value) => updateCriteria(index, { field: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <Label className="text-xs">Operator</Label>
                    <Select 
                      value={criterion.operator} 
                      onValueChange={(value) => updateCriteria(index, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-4">
                    <Label className="text-xs">Value</Label>
                    <Input
                      value={criterion.value}
                      onChange={(e) => updateCriteria(index, { value: e.target.value })}
                      placeholder="Enter value"
                      disabled={['is_empty', 'is_not_empty'].includes(criterion.operator)}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    {criteria.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCriteria(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={addCriteria}>
                <Filter className="h-4 w-4 mr-2" />
                Add Criteria
              </Button>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={handleClear}>
                  Clear All
                </Button>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}