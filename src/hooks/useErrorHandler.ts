import { useCallback } from 'react';
import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = true,
    logError = true,
    fallbackMessage = 'An unexpected error occurred',
    onError
  } = options;
  
  const { toast } = useToast();

  const handleError = useCallback(
    (error: Error | any, context?: string) => {
      // Ensure we have an Error object
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Log the error
      if (logError) {
        logger.error(`Error in ${context || 'unknown context'}`, errorObj);
      }
      
      // Show user-friendly toast
      if (showToast) {
        const message = getErrorMessage(errorObj, fallbackMessage);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive'
        });
      }
      
      // Call custom error handler
      if (onError) {
        onError(errorObj);
      }
    },
    [logError, showToast, fallbackMessage, onError, toast]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string,
      options?: { retries?: number; retryDelay?: number }
    ): Promise<T | null> => {
      const { retries = 0, retryDelay = 1000 } = options || {};
      
      let lastError: Error;
      
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await asyncFn();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          if (attempt < retries) {
            logger.warn(`Retry ${attempt + 1}/${retries} for ${context}`, { error: lastError });
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
          
          handleError(lastError, context);
          break;
        }
      }
      
      return null;
    },
    [handleError]
  );

  return { handleError, handleAsyncError };
}

// Helper function to extract user-friendly error messages
function getErrorMessage(error: Error, fallback: string): string {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  
  // Authentication errors
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    return 'Your session has expired. Please log in again.';
  }
  
  // Permission errors
  if (error.message.includes('403') || error.message.includes('forbidden')) {
    return 'You don\'t have permission to perform this action.';
  }
  
  // Not found errors
  if (error.message.includes('404') || error.message.includes('not found')) {
    return 'The requested resource could not be found.';
  }
  
  // Server errors
  if (error.message.includes('500') || error.message.includes('server error')) {
    return 'Server error. Please try again later.';
  }
  
  // Validation errors (if they have a user-friendly format)
  if (error.message && error.message.length < 100 && !error.message.includes('at ')) {
    return error.message;
  }
  
  return fallback;
}

// Hook for handling form errors specifically
export function useFormErrorHandler() {
  const { handleError } = useErrorHandler({
    showToast: false, // Forms usually show inline errors
    fallbackMessage: 'Please check your input and try again'
  });

  const handleFormError = useCallback(
    (error: Error | any, fieldErrors?: Record<string, string>) => {
      logger.error('Form submission error', error, { fieldErrors });
      
      // Return structured error info for forms to handle
      return {
        general: getErrorMessage(
          error instanceof Error ? error : new Error(String(error)),
          'Please check your input and try again'
        ),
        fields: fieldErrors || {}
      };
    },
    []
  );

  return { handleFormError };
}