import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './lib/contexts/AuthContext';
import { routes } from './routes';

function App() {
  console.log('App component rendering...');
  return (
    <HashRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          {routes}
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
