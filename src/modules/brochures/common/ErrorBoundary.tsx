/**
 * Brochure Builder - Error Boundary Component
 * 
 * This component provides error boundary functionality specifically for the
 * Brochure Builder module. It catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the entire app.
 * 
 * Features:
 * - Graceful error handling for brochure rendering
 * - User-friendly error messages
 * - Error reporting and logging
 * - Recovery mechanisms where possible
 * - Development vs production error displays
 * 
 * Use Cases:
 * - Wrapping the BrochureRenderer component
 * - Protecting template editor from malformed data
 * - Handling unknown block types safely
 * - Preventing crashes during export operations
 * 
 * Error Recovery:
 * - Provides retry mechanisms for transient errors
 * - Offers fallback content for missing data
 * - Maintains application state when possible
 * - Logs errors for debugging and improvement
 * 
 * TODO: Add error reporting to analytics
 * TODO: Add retry mechanisms for recoverable errors
 * TODO: Add error categorization and handling
 * TODO: Add integration with external error tracking
 */

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
  allowRetry?: boolean
  context?: string // Context for better error messages
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  retryCount: number
}

/**
 * Error boundary component for brochure builder
 */
export class BrochureErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error for debugging
    console.error('Brochure Builder Error:', error)
    console.error('Error Info:', errorInfo)

    // TODO: Send error to analytics
    // track('error_boundary_triggered', {
    //   error: error.message,
    //   context: this.props.context,
    //   componentStack: errorInfo.componentStack
    // })
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    })
  }

  handleGoHome = () => {
    window.location.href = '/brochures'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Something went wrong</CardTitle>
              <CardDescription>
                {this.props.context 
                  ? `An error occurred in the ${this.props.context}.`
                  : 'An unexpected error occurred while rendering the brochure.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error details (development only) */}
              {this.props.showDetails && this.state.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Error Details:
                  </p>
                  <p className="text-xs text-red-700 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                {/* Retry button */}
                {this.props.allowRetry && this.state.retryCount < this.maxRetries && (
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                  </Button>
                )}

                {/* Reset button */}
                <Button 
                  onClick={this.handleReset}
                  className="w-full"
                  variant="outline"
                >
                  Reset Component
                </Button>

                {/* Go home button */}
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="ghost"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Brochures
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  If this problem persists, try refreshing the page or contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <BrochureErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </BrochureErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook for handling errors in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    console.error('Component Error:', error)
    
    // TODO: Send to analytics
    // track('component_error', {
    //   error: error.message,
    //   stack: error.stack
    // })
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by error boundary
  if (error) {
    throw error
  }

  return { handleError, clearError }
}

/**
 * Simple error fallback component
 */
export const SimpleErrorFallback: React.FC<{
  error?: Error
  onRetry?: () => void
  message?: string
}> = ({ error, onRetry, message = 'Something went wrong' }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
    {error && (
      <p className="text-sm text-gray-600 mb-4">{error.message}</p>
    )}
    {onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
)

/**
 * Block-specific error fallback
 */
export const BlockErrorFallback: React.FC<{
  blockType?: string
  error?: Error
}> = ({ blockType = 'block', error }) => (
  <div className="border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50">
    <div className="flex items-center justify-center text-red-600">
      <AlertTriangle className="h-5 w-5 mr-2" />
      <span className="text-sm font-medium">
        Error rendering {blockType}
      </span>
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1 text-center">
        {error.message}
      </p>
    )}
  </div>
)

export default BrochureErrorBoundary