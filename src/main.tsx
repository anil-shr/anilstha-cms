import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DataProvider } from './context/DataContext';
import { RouterProvider } from './lib/router';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <DataProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </DataProvider>
  </ThemeProvider>
);
