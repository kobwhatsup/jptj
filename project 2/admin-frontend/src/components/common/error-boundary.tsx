import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('错误详情:', error);
    console.error('组件堆栈:', errorInfo.componentStack);
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={cn(
          "min-h-screen flex items-center justify-center bg-background p-4",
          "dark:bg-zinc-900"
        )}>
          <Card className="w-[400px] p-6">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="text-lg font-semibold">系统错误</AlertTitle>
              <AlertDescription className="mt-2">
                {this.state.error?.message || '发生未知错误，请稍后重试'}
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button
                variant="outline"
                onClick={this.handleRefresh}
                className="inline-flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                刷新页面
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
