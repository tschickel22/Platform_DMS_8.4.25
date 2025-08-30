import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logError, logger } from '@/utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showErrorDetails?: boolean
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
  retryCount: number
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    const errorId = `error_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    return { hasError: true, error, errorId }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    logError(error, errorInfo)

    // Custom handler
    this.props.onError?.(error, errorInfo)

    // Log user action
    logger.userAction('error_boundary_triggered', {
      errorId: this.state.errorId,
      retryCount: this.state.retryCount,
      resetKeys: this.props.resetKeys,
    })
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // If we weren't in error before but now are, nothing to do here
    if (!prevState.hasError && hasError) return

    // If in error, allow external changes to reset the boundary
    if (hasError) {
      // Reset if any prop changed and consumer opted in
      if (resetOnPropsChange && prevProps !== this.props) {
        this.resetErrorBoundary()
        return
      }

      // Reset when resetKeys change
      if (resetKeys) {
        const prev = prevProps.resetKeys ?? []
        const curr = resetKeys ?? []
        const keysChanged =
          prev.length !== curr.length ||
          curr.some((k, i) => k !== prev[i])

        if (keysChanged) this.resetErrorBoundary()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
      this.resetTimeoutId = null
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
      this.resetTimeoutId = null
    }

    this.setState(prev => ({
      hasError: false,
      error: null,
      errorId: null,
      retryCount: prev.retryCount + 1,
    }))

    logger.userAction('error_boundary_reset', {
      retryCount: this.state.retryCount + 1,
    })
  }

  retryWithDelay = (delay = 1000) => {
    this.setState({ hasError: false, error: null, errorId: null })
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary()
    }, delay)
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) return this.props.fallback

      // Default fallback UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. Don&apos;t worry, this has been logged and will be investigated.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {this.props.showErrorDetails && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.errorId && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Error ID: {this.state.errorId}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.resetErrorBoundary}
                  className="w-full"
                  disabled={this.state.retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {this.state.retryCount >= 3 ? 'Too many retries' : 'Try again'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/')}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Retry attempt: {this.state.retryCount}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized error boundaries
export const NetworkErrorBoundary: React.FC<{
  children: ReactNode
  onRetry?: () => void
}> = ({ children, onRetry }) => (
  <ErrorBoundary
    fallback={
      <div className="text-center py-8">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-4">
          Unable to connect to the server. Please check your internet connection.
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)

export const ModuleErrorBoundary: React.FC<{
  children: ReactNode
  moduleName: string
}> = ({ children, moduleName }) => (
  <ErrorBoundary
    fallback={
      <div className="p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Module Error</h3>
        <p className="text-muted-foreground">
          The {moduleName} module encountered an error and couldn&apos;t load.
        </p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
)

// Export default AND named to satisfy both import styles
export default ErrorBoundary
export { ErrorBoundary }
