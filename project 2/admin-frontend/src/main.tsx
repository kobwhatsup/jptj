import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// Enable more detailed error reporting
window.addEventListener('error', (event) => {
  console.error('Script error:', event);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('main.tsx is being executed');
console.log('Environment:', import.meta.env);

// Track React initialization
try {
  console.log('Starting app initialization...');
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);

  if (rootElement) {
    console.log('Creating root and rendering app...');
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    );
    console.log('App rendered successfully');
  } else {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: Root element not found</div>';
  }
} catch (error) {
  console.error('Fatal error during app initialization:', error);
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Fatal error during app initialization</div>';
}
