import { useState, useCallback } from 'react'
import { BulkOperation, BulkOperationType, BulkOperationStatus, BulkOperationResult } from '@/types'
import { generateId } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export function useBulkOperations() {
  const [operations, setOperations] = useState<BulkOperation[]>([])
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  // Start a bulk operation
  const startBulkOperation = useCallback(async (
    type: BulkOperationType,
    entityType: 'accounts' | 'contacts' | 'leads',
    entityIds: string[],
    operation: string,
    parameters?: Record<string, any>
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated')

    const bulkOp: BulkOperation = {
      id: generateId(),
      type,
      entityType,
      entityIds,
      operation,
      parameters,
      status: BulkOperationStatus.PENDING,
      progress: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.name
    }

    setOperations(prev => [bulkOp, ...prev])
    setCurrentOperation(bulkOp)

    // Simulate processing
    setTimeout(() => processBulkOperation(bulkOp), 100)

    return bulkOp.id
  }, [user])

  // Process bulk operation (mock implementation)
  const processBulkOperation = useCallback(async (operation: BulkOperation) => {
    const updateProgress = (progress: number, status?: BulkOperationStatus) => {
      const updated = { ...operation, progress, status: status || operation.status }
      setCurrentOperation(updated)
      setOperations(prev => prev.map(op => op.id === operation.id ? updated : op))
    }

    try {
      updateProgress(0, BulkOperationStatus.RUNNING)

      const results: BulkOperationResult[] = []
      const totalItems = operation.entityIds.length

      // Simulate processing each item
      for (let i = 0; i < totalItems; i++) {
        const entityId = operation.entityIds[i]
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 200))

        // Mock success/failure (90% success rate)
        const success = Math.random() > 0.1
        
        results.push({
          entityId,
          success,
          error: success ? undefined : 'Mock processing error',
          data: success ? { processed: true } : undefined
        })

        updateProgress(Math.round(((i + 1) / totalItems) * 100))
      }

      // Complete operation
      const completedOp = {
        ...operation,
        status: BulkOperationStatus.COMPLETED,
        progress: 100,
        results,
        completedAt: new Date().toISOString()
      }

      setCurrentOperation(completedOp)
      setOperations(prev => prev.map(op => op.id === operation.id ? completedOp : op))

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      toast({
        title: 'Bulk Operation Complete',
        description: `${successCount} items processed successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`
      })

    } catch (error) {
      const failedOp = {
        ...operation,
        status: BulkOperationStatus.FAILED,
        completedAt: new Date().toISOString()
      }

      setCurrentOperation(failedOp)
      setOperations(prev => prev.map(op => op.id === operation.id ? failedOp : op))

      toast({
        title: 'Bulk Operation Failed',
        description: 'The bulk operation encountered an error',
        variant: 'destructive'
      })
    }
  }, [toast])

  // Cancel operation
  const cancelOperation = useCallback((operationId: string) => {
    setOperations(prev => prev.map(op => 
      op.id === operationId 
        ? { ...op, status: BulkOperationStatus.CANCELLED, completedAt: new Date().toISOString() }
        : op
    ))
    
    if (currentOperation?.id === operationId) {
      setCurrentOperation(null)
    }
  }, [currentOperation])

  // Get operation by ID
  const getOperation = useCallback((operationId: string) => {
    return operations.find(op => op.id === operationId)
  }, [operations])

  return {
    operations,
    currentOperation,
    startBulkOperation,
    cancelOperation,
    getOperation
  }
}