import React, { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ErrorBoundary, { ModuleErrorBoundary } from '@/components/ErrorBoundary'
import { DetailViewSkeleton, PageHeaderSkeleton } from '@/components/ui/loading-states'
import { useToast } from '@/hooks/use-toast'

interface RouteGuardProps {
  children: React.ReactNode
  moduleName?: string
  fallback?: React.ReactNode
}

export function RouteGuard({ children, moduleName, fallback }: RouteGuardProps) {
  const FallbackComponent = moduleName ? ModuleErrorBoundary : ErrorBoundary
  const fallbackProps = moduleName ? { moduleName } : {}

  return (
    <FallbackComponent {...fallbackProps}>
      <Suspense fallback={fallback || <PageHeaderSkeleton />}>
        {children}
      </Suspense>
    </FallbackComponent>
  )
}

interface DetailRouteGuardProps {
  children: React.ReactNode
  entityId: string | undefined
  entityName: string
  listPath: string
  moduleName?: string
}

export function DetailRouteGuard({
  children,
  entityId,
  entityName,
  listPath,
  moduleName
}: DetailRouteGuardProps) {
  const { toast } = useToast()

  React.useEffect(() => {
    if (!entityId) {
      toast({
        title: `${entityName} Not Found`,
        description: `The ${entityName.toLowerCase()} you're looking for could not be found.`,
        variant: 'destructive'
      })
    }
  }, [entityId, entityName, toast])

  if (!entityId) {
    return <Navigate to={listPath} replace />
  }

  return (
    <RouteGuard 
      moduleName={moduleName} 
      fallback={<DetailViewSkeleton />}
    >
      {children}
    </RouteGuard>
  )
}

interface EntityNotFoundGuardProps {
  entity: any
  entityName: string
  listPath: string
  children: React.ReactNode
}

export function EntityNotFoundGuard({
  entity,
  entityName,
  listPath,
  children
}: EntityNotFoundGuardProps) {
  const { toast } = useToast()

  React.useEffect(() => {
    if (!entity) {
      toast({
        title: `${entityName} Not Found`,
        description: `The ${entityName.toLowerCase()} you're looking for could not be found.`,
        variant: 'destructive'
      })
    }
  }, [entity, entityName, toast])

  if (!entity) {
    return <Navigate to={listPath} replace />
  }

  return <>{children}</>
}