import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

interface ApiErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ApiError: React.FC<ApiErrorProps> = ({
  error,
  onRetry,
  className = ''
}) => {
  return (
    <Alert variant="destructive" className={`max-w-md ${className}`}>
      <AlertTitle>操作失败</AlertTitle>
      <AlertDescription className="mt-2 space-y-4">
        <p>{error}</p>
        {onRetry && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
