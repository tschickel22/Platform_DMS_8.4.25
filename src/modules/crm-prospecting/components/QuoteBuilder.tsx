import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Save, Plus, Trash2, Download, Calculator, Package, Percent, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { TagSelector } from '@/modules/tagging-engine'
import { TagType } from '@/modules/tagging-engine/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface QuoteLineItem {
  id: string
  productId?: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
  isBundle?: boolean
  bundleItems?: QuoteLineItem[]
}

interface PricingRule {
  id: string
  name: string
  type: 'quantity_discount' | 'bundle_discount' | 'customer_discount'
  conditions: {
    minQuantity?: number
    productIds?: string[]
    customerType?: string
  }
  discount: {
    type: 'percentage' | 'fixed'
    value: number
  }
  isActive: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  isBundle?: boolean
  bundleItems?: { productId: string; quantity: number }[]
}

interface QuoteBuilderProps {
  quote?: any
  customerId: string
  onSave: (quoteData: any) => void
  onCancel: () => void
}

const mockProducts: Product[] = [
  { id: '1', name: '2024 Forest River Georgetown', description: 'Class A Motorhome with premium features', price: 125000, category: 'motorhome' },
  { id: '2', name: 'Extended Warranty', description: '3-year comprehensive warranty coverage', price: 2500, category: 'warranty' },
  { id: '3', name: 'Solar Panel Package', description: '400W solar panel system with inverter', price: 3500, category: 'accessory' },
  {
    id: '4', name: 'Premium Package', description: 'Includes extended warranty, solar panels, and premium interior', price: 8000,
    category: 'bundle', isBundle: true,
    bundleItems: [{ productId: '2', quantity: 1 }, { productId: '3', quantity: 1 }, { productId: '5', quantity: 1 }]
  },
  { id: '5', name: 'Premium Interior Upgrade', description: 'Leather seating and premium finishes', price: 2200, category: 'upgrade' }
]

const mockPricingRules: PricingRule[] = [
  { id: '1', name: 'Bulk Accessory Discount', type: 'quantity_discount', conditions: { minQuantity: 3 }, discount: { type: 'percentage', value: 10 }, isActive: true },
  { id: '2', name: 'Premium Bundle Discount', type: 'bundle_discount', conditions: { productIds: ['4'] }, discount: { type: 'fixed', value: 500 }, isActive: true }
]

export function QuoteBuilder({ quote, customerId, onSave, onCancel }: QuoteBuilderProps) {
  const { toast } = useToast()
  const { getAvailableVehicles, getVehicleById } = useInventoryManagement()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('items')

  const [quoteData, setQuoteData] = useState({
    customerId,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    notes: '',
    terms: 'Payment due within 30 days. All sales final.',
    items: [] as QuoteLineItem[],
    subtotal: 0,        // pre-discount subtotal (GROSS)
    totalDiscount: 0,   // total discount amount
    tax: 0,
    taxRate: 0.08,
    total: 0
  })

  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<QuoteLineItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    discountType: 'percentage'
  })

  const availableVehicles = getAvailableVehicles()

  useEffect(() => {
    if (quote) setQuoteData(prev => ({ ...prev, ...quote }))
  }, [quote])

  // ---------- helpers ----------
  const calculateLineTotal = (item: QuoteLineItem) => {
    const base = (item.quantity || 0) * (item.unitPrice || 0)
    const discountAmount = item.discountType === 'percentage'
      ? base * ((item.discount || 0) / 100)
      : (item.discount || 0) * (item.quantity || 0)
    return Math.max(0, base - discountAmount)
  }

  // Apply pricing rules to a provided array of items (pure, returns new array)
  const applyPricingRulesToItems = (items: QuoteLineItem[]) => {
    const cloned = items.map(i => ({ ...i }))
    const isAccessory = (li: QuoteLineItem) =>
      !!mockProducts.find(p => p.id === li.productId && p.category === 'accessory')
    const accessoryCount = cloned.filter(isAccessory).length

    return cloned.map(item => {
      let discount = item.discount
      let discountType = item.discountType

      // quantity_discount: 3+ accessory items → 10% on accessories
      if (accessoryCount >= 3 && isAccessory(item)) {
        discount = 10
        discountType = 'percentage'
      }

      // bundle_discount: flat $500 on bundle line
      if (item.isBundle) {
        discount = 500
        discountType = 'fixed'
      }

      const updated = { ...item, discount, discountType }
      updated.total = calculateLineTotal(updated)
      return updated
    })
  }

  const recalcTotals = (items: QuoteLineItem[], taxRate = quoteData.taxRate) => {
    const gross = items.reduce((sum, li) => sum + (li.quantity * li.unitPrice), 0)
    const totalDiscount = items.reduce((sum, li) => {
      const base = li.quantity * li.unitPrice
      const d = li.discountType === 'percentage'
        ? base * (li.discount / 100)
        : li.discount * li.quantity
      return sum + d
    }, 0)
    const afterDiscount = Math.max(0, gross - totalDiscount)
    const tax = afterDiscount * taxRate
    const total = afterDiscount + tax

    return { subtotal: gross, totalDiscount, tax, total }
  }

  // keep totals in sync
  useEffect(() => {
    const { subtotal, totalDiscount, tax, total } = recalcTotals(quoteData.items, quoteData.taxRate)
    setQuoteData(prev => ({ ...prev, subtotal, totalDiscount, tax, total }))
  }, [quoteData.items, quoteData.taxRate])

  // ---------- actions ----------
  const addVehicleToQuote = (vehicleId: string) => {
    const vehicle = getVehicleById(vehicleId)
    if (!vehicle) return

    const newLi: QuoteLineItem = {
      id: crypto.randomUUID(),
      productId: vehicle.id,
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      quantity: 1,
      unitPrice: vehicle.price,
      discount: 0,
      discountType: 'percentage',
      total: vehicle.price
    }

    setQuoteData(prev => {
      const items = applyPricingRulesToItems([...prev.items, newLi])
      return { ...prev, items }
    })

    setSelectedVehicle('')
    toast({ title: 'Vehicle Added', description: `${vehicle.year} ${vehicle.make} ${vehicle.model} added to quote` })
  }

  const addProductToQuote = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (!product) return

    let toAdd: QuoteLineItem
    if (product.isBundle && product.bundleItems) {
      toAdd = {
        id: crypto.randomUUID(),
        productId: product.id,
        description: product.description,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        discountType: 'percentage',
        total: product.price,
        isBundle: true,
        bundleItems: product.bundleItems.map(bi => {
          const bp = mockProducts.find(p => p.id === bi.productId)
          return {
            id: crypto.randomUUID(),
            productId: bi.productId,
            description: bp?.name || '',
            quantity: bi.quantity,
            unitPrice: bp?.price || 0,
            discount: 0,
            discountType: 'percentage',
            total: (bp?.price || 0) * bi.quantity
          }
        })
      }
    } else {
      toAdd = {
        id: crypto.randomUUID(),
        productId: product.id,
        description: product.name,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        discountType: 'percentage',
        total: product.price
      }
    }

    setQuoteData(prev => {
      const items = applyPricingRulesToItems([...prev.items, toAdd])
      return { ...prev, items }
    })
  }

  const addLineItem = () => {
    if (!newItem.description || !newItem.unitPrice) {
      toast({ title: 'Validation Error', description: 'Description and unit price are required', variant: 'destructive' })
      return
    }

    const li: QuoteLineItem = {
      id: crypto.randomUUID(),
      description: newItem.description!,
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      discount: newItem.discount || 0,
      discountType: newItem.discountType || 'percentage',
      total: calculateLineTotal(newItem as QuoteLineItem)
    }

    setQuoteData(prev => {
      const items = applyPricingRulesToItems([...prev.items, li])
      return { ...prev, items }
    })

    setNewItem({ description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'percentage' })
    setShowAddItem(false)
  }

  const updateLineItem = (itemId: string, updates: Partial<QuoteLineItem>) => {
    setQuoteData(prev => {
      const items = prev.items.map(i => {
        if (i.id !== itemId) return i
        const updated = { ...i, ...updates }
        updated.total = calculateLineTotal(updated)
        return updated
      })
      // re-apply rules on the new array to keep consistency
      return { ...prev, items: applyPricingRulesToItems(items) }
    })
  }

  const removeLineItem = (itemId: string) => {
    setQuoteData(prev => {
      const items = prev.items.filter(i => i.id !== itemId)
      return { ...prev, items: applyPricingRulesToItems(items) }
    })
  }

  const generatePDF = async () => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      const pdfContent = `
QUOTE DOCUMENT
==============
Customer ID: ${quoteData.customerId}
Valid Until: ${quoteData.validUntil?.toLocaleDateString?.() || ''}

LINE ITEMS:
-----------
${quoteData.items.map(item => `
${item.description}
Quantity: ${item.quantity} x ${formatCurrency(item.unitPrice)}
${item.discount > 0 ? `Discount: ${item.discount}${item.discountType === 'percentage' ? '%' : ''}` : ''}
Total: ${formatCurrency(item.total)}
${item.isBundle ? `  Bundle Items:\n  ${item.bundleItems?.map(b => `- ${b.description} (${b.quantity}x)`).join('\n  ')}` : ''}
`).join('\n')}

TOTALS:
-------
Subtotal (pre-discount): ${formatCurrency(quoteData.subtotal)}
Total Discount: ${formatCurrency(quoteData.totalDiscount)}
Tax (${(quoteData.taxRate * 100).toFixed(1)}%): ${formatCurrency(quoteData.tax)}
TOTAL: ${formatCurrency(quoteData.total)}

Notes: ${quoteData.notes}
Terms: ${quoteData.terms}
`
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quote-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: 'PDF Generated', description: 'Quote exported successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to generate PDF', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (quoteData.items.length === 0) {
      toast({ title: 'Validation Error', description: 'At least one line item is required', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      await onSave({ ...quoteData, customerId: quoteData.customerId || customerId })
      toast({ title: 'Success', description: 'Quote saved successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save quote', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                {quote ? 'Edit Quote' : 'Create Quote'}
              </CardTitle>
              <CardDescription>Create quotes with line items, bundles, and pricing rules</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" /></Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="items">Line Items</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
              <TabsTrigger value="details">Quote Details</TabsTrigger>
            </TabsList>

            {/* ITEMS */}
            <TabsContent value="items" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quote Line Items</h3>
                <div className="flex space-x-2">
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="w-64"><SelectValue placeholder="Add vehicle from inventory" /></SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.year} {v.make} {v.model} - {formatCurrency(v.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVehicle && (
                    <Button onClick={() => addVehicleToQuote(selectedVehicle)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />Add Vehicle
                    </Button>
                  )}
                  <Button onClick={() => setShowAddItem(true)} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />Custom Item
                  </Button>
                </div>
              </div>

              {showAddItem && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div><Label>Description</Label>
                        <Input value={newItem.description || ''} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} placeholder="Item description" />
                      </div>
                      <div><Label>Unit Price</Label>
                        <Input type="number" value={newItem.unitPrice ?? ''} onChange={e => setNewItem(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))} placeholder="0.00" />
                      </div>
                      <div><Label>Quantity</Label>
                        <Input type="number" value={newItem.quantity || 1} onChange={e => setNewItem(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} min="1" />
                      </div>
                      <div>
                        <Label>Discount</Label>
                        <div className="flex space-x-2">
                          <Input type="number" value={newItem.discount || 0} onChange={e => setNewItem(p => ({ ...p, discount: parseFloat(e.target.value) || 0 }))} placeholder="0" />
                          <Select value={newItem.discountType} onValueChange={(v: 'percentage' | 'fixed') => setNewItem(p => ({ ...p, discountType: v }))}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="percentage">%</SelectItem><SelectItem value="fixed">$</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddItem(false)}>Cancel</Button>
                      <Button onClick={addLineItem}>Add Item</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {quoteData.items.map(item => (
                  <Card key={item.id} className="shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 grid gap-4 md:grid-cols-4">
                          <div>
                            <Label>Description</Label>
                            <Input value={item.description} onChange={e => updateLineItem(item.id, { description: e.target.value })} />
                            {item.isBundle && (
                              <Badge className="mt-1 bg-purple-50 text-purple-700 border-purple-200">
                                <Package className="h-3 w-3 mr-1" />Bundle
                              </Badge>
                            )}
                          </div>
                          <div><Label>Quantity</Label>
                            <Input type="number" value={item.quantity} onChange={e => updateLineItem(item.id, { quantity: parseInt(e.target.value) || 1 })} min="1" />
                          </div>
                          <div><Label>Unit Price</Label>
                            <Input type="number" value={item.unitPrice} onChange={e => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} step="0.01" />
                          </div>
                          <div>
                            <Label>Discount</Label>
                            <div className="flex space-x-2">
                              <Input type="number" value={item.discount} onChange={e => updateLineItem(item.id, { discount: parseFloat(e.target.value) || 0 })} step="0.01" />
                              <Select value={item.discountType} onValueChange={(v: 'percentage' | 'fixed') => updateLineItem(item.id, { discountType: v })}>
                                <SelectTrigger className="w-16"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="percentage">%</SelectItem><SelectItem value="fixed">$</SelectItem></SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className="font-bold text-lg">{formatCurrency(item.total)}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => removeLineItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {item.isBundle && item.bundleItems && (
                        <div className="mt-4 pl-4 border-l-2 border-purple-200">
                          <h4 className="text-sm font-semibold text-purple-700 mb-2">Bundle Contents:</h4>
                          <div className="space-y-2">
                            {item.bundleItems.map(b => (
                              <div key={b.id} className="flex items-center justify-between text-sm bg-purple-50 p-2 rounded">
                                <span>{b.description}</span>
                                <span>{b.quantity}x {formatCurrency(b.unitPrice)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {quoteData.items.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No line items added yet</p>
                    <p className="text-sm">Add products or custom items to build your quote</p>
                  </div>
                )}
              </div>

              {quoteData.items.length > 0 && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Subtotal (pre-discount):</span><span>{formatCurrency(quoteData.subtotal)}</span></div>
                      <div className="flex justify-between text-red-600"><span>Total Discount:</span><span>-{formatCurrency(quoteData.totalDiscount)}</span></div>
                      <div className="flex justify-between"><span>Tax ({(quoteData.taxRate * 100).toFixed(1)}%):</span><span>{formatCurrency(quoteData.tax)}</span></div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total:</span><span>{formatCurrency(quoteData.total)}</span></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* PRODUCTS */}
            <TabsContent value="products" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Inventory & Products</h3>

                <div className="mb-8">
                  <h4 className="text-md font-semibold mb-3 text-blue-600">Available Vehicles</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableVehicles.map(v => (
                      <Card key={v.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{v.year} {v.make} {v.model}</h4>
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">{v.type.replace('_',' ').toUpperCase()}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">VIN: {v.vin}</p>
                              <p className="text-sm text-muted-foreground mb-2">Location: {v.location}</p>
                              <div className="text-lg font-bold text-primary">{formatCurrency(v.price)}</div>
                              {v.features?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {v.features.slice(0,3).map((f: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                                  ))}
                                  {v.features.length > 3 && <Badge variant="outline" className="text-xs">+{v.features.length-3} more</Badge>}
                                </div>
                              )}
                            </div>
                            <Button onClick={() => addVehicleToQuote(v.id)} size="sm" className="ml-4">
                              <Plus className="h-4 w-4 mr-1" />Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3 text-green-600">Available Products & Services</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mockProducts.map(p => (
                      <Card key={p.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{p.name}</h4>
                                {p.isBundle && (
                                  <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                                    <Package className="h-3 w-3 mr-1" />Bundle
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                              <div className="text-lg font-bold text-primary">{formatCurrency(p.price)}</div>
                              {p.isBundle && p.bundleItems && (
                                <div className="mt-3 p-2 bg-purple-50 rounded">
                                  <div className="text-xs font-semibold text-purple-700 mb-1">Includes:</div>
                                  {p.bundleItems.map(bi => {
                                    const bp = mockProducts.find(mp => mp.id === bi.productId)
                                    return <div key={bi.productId} className="text-xs text-purple-600">• {bp?.name} ({bi.quantity}x)</div>
                                  })}
                                </div>
                              )}
                            </div>
                            <Button onClick={() => addProductToQuote(p.id)} size="sm" className="ml-4">
                              <Plus className="h-4 w-4 mr-1" />Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* PRICING */}
            <TabsContent value="pricing" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Active Pricing Rules</h3>
                <div className="space-y-4">
                  {mockPricingRules.filter(r => r.isActive).map(r => (
                    <Card key={r.id} className="shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{r.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {r.type === 'quantity_discount' && `Min quantity: ${r.conditions.minQuantity}`}
                              {r.type === 'bundle_discount' && 'Applied to bundle products'}
                              {r.type === 'customer_discount' && `Customer type: ${r.conditions.customerType}`}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                <Percent className="h-3 w-3 mr-1" />
                                {r.discount.type === 'percentage' ? `${r.discount.value}%` : formatCurrency(r.discount.value)} off
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuoteData(prev => ({ ...prev, items: applyPricingRulesToItems(prev.items) }))}
                          >
                            <Calculator className="h-4 w-4 mr-1" />Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* DETAILS */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={(quoteData.validUntil instanceof Date ? quoteData.validUntil : new Date(quoteData.validUntil)).toISOString().split('T')[0]}
                    onChange={e => setQuoteData(prev => ({ ...prev, validUntil: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={(quoteData.taxRate * 100).toFixed(2)}
                    onChange={e => setQuoteData(prev => ({ ...prev, taxRate: (parseFloat(e.target.value) || 0) / 100 }))}
                    step="0.01" min="0" max="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <TagSelector
                  entityId={quote?.id || 'new-quote'}
                  entityType={TagType.DEAL /* change to TagType.QUOTE if you have it */}
                  onTagsChange={() => {}}
                  placeholder="Add quote tags..."
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={quoteData.notes} onChange={e => setQuoteData(prev => ({ ...prev, notes: e.target.value }))} rows={3} />
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" value={quoteData.terms} onChange={e => setQuoteData(prev => ({ ...prev, terms: e.target.value }))} rows={4} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={generatePDF} disabled={loading || quoteData.items.length === 0}>
                <Download className="h-4 w-4 mr-2" />{loading ? 'Generating...' : 'Export PDF'}
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Quote</>)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * OPTIONAL: tile filter wiring helper for your Quotes page (not this modal).
 * Call this on click of each tile to set filters & go to the "quotes" tab.
 * Example: onClick={() => applyQuoteTileFilter('pending')}
 */
export const applyQuoteTileFilter = (
  setActiveTab: (v: string) => void,
  setStatusFilter: (v: string) => void,
  status: 'all' | 'pending' | 'accepted' | 'rejected'
) => {
  setActiveTab('quotes')
  setStatusFilter(status)
}
