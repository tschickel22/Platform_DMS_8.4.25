import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Calculator, DollarSign, Percent, Target } from 'lucide-react'
import { mockCommissionEngine } from '@/mocks/commissionEngineMock'

interface CommissionRule {
  id: string
  name: string
  type: 'percentage' | 'flat' | 'tiered' | 'bonus'
  value: number
  conditions: {
    minAmount?: number
    maxAmount?: number
    productType?: string
    salesPerson?: string
    timeframe?: string
  }
  isActive: boolean
}

interface CommissionFormProps {
  ruleId?: string
  onSave?: (rule: CommissionRule) => void
  onCancel?: () => void
}

export default function CommissionForm({ ruleId, onSave, onCancel }: CommissionFormProps) {
  const [rule, setRule] = useState<CommissionRule>({
    id: '',
    name: '',
    type: 'percentage',
    value: 0,
    conditions: {},
    isActive: true
  })

  const [tiers, setTiers] = useState<Array<{ min: number; max: number; rate: number }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (ruleId) {
      // Load existing rule
      const existingRule = mockCommissionEngine.sampleRules.find(r => r.id === ruleId)
      if (existingRule) {
        setRule(existingRule)
        // If it's a tiered rule, set up tiers
        if (existingRule.type === 'tiered' && existingRule.tiers) {
          setTiers(existingRule.tiers)
        }
      }
    }
  }, [ruleId])

  const handleInputChange = (field: keyof CommissionRule, value: any) => {
    setRule(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleConditionChange = (field: string, value: any) => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }))
  }

  const addTier = () => {
    setTiers(prev => [...prev, { min: 0, max: 0, rate: 0 }])
  }

  const removeTier = (index: number) => {
    setTiers(prev => prev.filter((_, i) => i !== index))
  }

  const updateTier = (index: number, field: 'min' | 'max' | 'rate', value: number) => {
    setTiers(prev => prev.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!rule.name.trim()) {
      newErrors.name = 'Rule name is required'
    }

    if (rule.value <= 0 && rule.type !== 'tiered') {
      newErrors.value = 'Value must be greater than 0'
    }

    if (rule.type === 'tiered' && tiers.length === 0) {
      newErrors.tiers = 'At least one tier is required for tiered commissions'
    }

    // Validate tiers
    tiers.forEach((tier, index) => {
      if (tier.min < 0) {
        newErrors[`tier_${index}_min`] = 'Minimum amount cannot be negative'
      }
      if (tier.max <= tier.min) {
        newErrors[`tier_${index}_max`] = 'Maximum must be greater than minimum'
      }
      if (tier.rate <= 0) {
        newErrors[`tier_${index}_rate`] = 'Rate must be greater than 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const finalRule: CommissionRule = {
      ...rule,
      id: rule.id || `rule_${Date.now()}`,
      ...(rule.type === 'tiered' && { tiers })
    }

    onSave?.(finalRule)
  }

  const calculatePreview = () => {
    const sampleAmount = 50000 // $50,000 sample sale
    let commission = 0

    switch (rule.type) {
      case 'percentage':
        commission = sampleAmount * (rule.value / 100)
        break
      case 'flat':
        commission = rule.value
        break
      case 'tiered':
        // Use tiers array safely with fallback
        const safeTiers = tiers || []
        for (const tier of safeTiers) {
          if (sampleAmount >= tier.min && sampleAmount <= tier.max) {
            commission = sampleAmount * (tier.rate / 100)
            break
          }
        }
        break
      case 'bonus':
        commission = rule.value
        break
    }

    return commission
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {ruleId ? 'Edit Commission Rule' : 'New Commission Rule'}
          </CardTitle>
          <CardDescription>
            Configure commission rules and conditions for your sales team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={rule.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter rule name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Commission Type</Label>
              <Select value={rule.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="flat">Flat Amount</SelectItem>
                  <SelectItem value="tiered">Tiered</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Commission Value */}
          {rule.type !== 'tiered' && (
            <div className="space-y-2">
              <Label htmlFor="value">
                {rule.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  value={rule.value}
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                  placeholder={rule.type === 'percentage' ? '5.0' : '1000'}
                  className={`pl-8 ${errors.value ? 'border-red-500' : ''}`}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {rule.type === 'percentage' ? <Percent className="h-4 w-4 text-muted-foreground" /> : <DollarSign className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          )}

          {/* Tiered Commission Setup */}
          {rule.type === 'tiered' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Commission Tiers</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>
              
              {errors.tiers && <p className="text-sm text-red-500">{errors.tiers}</p>}
              
              <div className="space-y-3">
                {(tiers || []).map((tier, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Min Amount ($)</Label>
                        <Input
                          type="number"
                          value={tier.min}
                          onChange={(e) => updateTier(index, 'min', parseFloat(e.target.value) || 0)}
                          className={errors[`tier_${index}_min`] ? 'border-red-500' : ''}
                        />
                        {errors[`tier_${index}_min`] && <p className="text-xs text-red-500">{errors[`tier_${index}_min`]}</p>}
                      </div>
                      <div>
                        <Label className="text-xs">Max Amount ($)</Label>
                        <Input
                          type="number"
                          value={tier.max}
                          onChange={(e) => updateTier(index, 'max', parseFloat(e.target.value) || 0)}
                          className={errors[`tier_${index}_max`] ? 'border-red-500' : ''}
                        />
                        {errors[`tier_${index}_max`] && <p className="text-xs text-red-500">{errors[`tier_${index}_max`]}</p>}
                      </div>
                      <div>
                        <Label className="text-xs">Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={tier.rate}
                          onChange={(e) => updateTier(index, 'rate', parseFloat(e.target.value) || 0)}
                          className={errors[`tier_${index}_rate`] ? 'border-red-500' : ''}
                        />
                        {errors[`tier_${index}_rate`] && <p className="text-xs text-red-500">{errors[`tier_${index}_rate`]}</p>}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTier(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Conditions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Conditions (Optional)</Label>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Sale Amount ($)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={rule.conditions.minAmount || ''}
                  onChange={(e) => handleConditionChange('minAmount', parseFloat(e.target.value) || undefined)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Sale Amount ($)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={rule.conditions.maxAmount || ''}
                  onChange={(e) => handleConditionChange('maxAmount', parseFloat(e.target.value) || undefined)}
                  placeholder="No limit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Select 
                  value={rule.conditions.productType || ''} 
                  onValueChange={(value) => handleConditionChange('productType', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Products</SelectItem>
                    <SelectItem value="RV">RV</SelectItem>
                    <SelectItem value="Mobile Home">Mobile Home</SelectItem>
                    <SelectItem value="Accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select 
                  value={rule.conditions.timeframe || ''} 
                  onValueChange={(value) => handleConditionChange('timeframe', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Timeframe</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="isActive">Rule Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this commission rule
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={rule.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                {rule.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Commission Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">
                Sample calculation for $50,000 sale:
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${calculatePreview().toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {ruleId ? 'Update Rule' : 'Create Rule'}
        </Button>
      </div>
    </div>
  )
}
export { CommissionForm }