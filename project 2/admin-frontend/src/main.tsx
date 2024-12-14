import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// Add global error handler for uncaught errors
window.addEventListener('error', (event: ErrorEvent) => {
  console.error('Global error:', {
    message: event.error?.message || 'Unknown error',
    stack: event.error?.stack || 'No stack trace',
    type: event.type,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Add global promise rejection handler
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', {
    reason: event.reason,
    stack: event.reason?.stack || 'No stack trace'
  });
});

console.log('Starting React initialization...');
console.log('React version:', (React as any).version || 'unknown');

try {
  console.log('Finding root element...');
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);

  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }

  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created successfully');

  console.log('Starting render...');
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
  console.log('Render completed successfully');
} catch (error: unknown) {
  const err = error as Error;
  console.error('React initialization error:', {
    message: err?.message || 'Unknown error',
    stack: err?.stack || 'No stack trace',
    type: err?.constructor?.name || 'Unknown type'
  });
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Failed to initialize React application. Check console for details.</div>`;
}
