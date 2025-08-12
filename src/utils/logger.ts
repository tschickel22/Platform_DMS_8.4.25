type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
  companyId?: string;
  sessionId?: string;
}

class Logger {
  private sessionId: string;
  private isDev: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isDev = import.meta.env.DEV;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      sessionId: this.sessionId,
      // These can be populated from auth context if available
      userId: this.getCurrentUserId(),
      companyId: this.getCurrentCompanyId()
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      // This would typically come from your auth context
      return localStorage.getItem('currentUserId') || undefined;
    } catch {
      return undefined;
    }
  }

  private getCurrentCompanyId(): string | undefined {
    try {
      // This would typically come from your tenant context
      return localStorage.getItem('currentCompanyId') || undefined;
    } catch {
      return undefined;
    }
  }

  private sendToExternalService(logEntry: LogEntry): void {
    // In production, you would send logs to services like:
    // - Sentry for error tracking
    // - Datadog for general logging
    // - LogRocket for user session recording
    // - Custom analytics endpoint
    
    if (!this.isDev) {
      // Example: Send to external logging service
      try {
        fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEntry)
        }).catch(err => {
          console.warn('Failed to send log to external service:', err);
        });
      } catch (error) {
        // Silently fail external logging to avoid cascading issues
      }
    }
  }

  debug(message: string, context?: any): void {
    const logEntry = this.createLogEntry('debug', message, context);
    
    if (this.isDev) {
      console.debug(`🐛 [DEBUG] ${message}`, context);
    }
    
    this.sendToExternalService(logEntry);
  }

  info(message: string, context?: any): void {
    const logEntry = this.createLogEntry('info', message, context);
    
    if (this.isDev) {
      console.info(`ℹ️ [INFO] ${message}`, context);
    }
    
    this.sendToExternalService(logEntry);
  }

  warn(message: string, context?: any): void {
    const logEntry = this.createLogEntry('warn', message, context);
    
    console.warn(`⚠️ [WARN] ${message}`, context);
    this.sendToExternalService(logEntry);
  }

  error(message: string, error?: Error | any, context?: any): void {
    const logEntry = this.createLogEntry('error', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context
    });
    
    console.error(`❌ [ERROR] ${message}`, error, context);
    this.sendToExternalService(logEntry);
  }

  // Specialized logging methods
  userAction(action: string, details?: any): void {
    this.info(`User Action: ${action}`, { action, details, type: 'user_action' });
  }

  apiCall(method: string, url: string, status?: number, duration?: number, error?: any): void {
    const level = status && status >= 400 ? 'error' : 'debug';
    const message = `API Call: ${method} ${url}`;
    
    const context = {
      method,
      url,
      status,
      duration,
      error,
      type: 'api_call'
    };

    if (level === 'error') {
      this.error(message, error, context);
    } else {
      this.debug(message, context);
    }
  }

  performanceMetric(metric: string, value: number, context?: any): void {
    this.debug(`Performance: ${metric}`, { 
      metric, 
      value, 
      context, 
      type: 'performance' 
    });
  }

  pageView(path: string, context?: any): void {
    this.info(`Page View: ${path}`, { 
      path, 
      context, 
      type: 'page_view',
      timestamp: Date.now()
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Error boundary helper
export const logError = (error: Error, errorInfo: any) => {
  logger.error('React Error Boundary Caught Error', error, {
    componentStack: errorInfo.componentStack,
    errorBoundary: true
  });
};

// Performance monitoring helpers
export const measurePerformance = <T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> => {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(
        (value) => {
          const duration = performance.now() - start;
          logger.performanceMetric(name, duration);
          return value;
        },
        (error) => {
          const duration = performance.now() - start;
          logger.performanceMetric(name, duration, { error: true });
          throw error;
        }
      );
    } else {
      const duration = performance.now() - start;
      logger.performanceMetric(name, duration);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    logger.performanceMetric(name, duration, { error: true });
    throw error;
  }
};