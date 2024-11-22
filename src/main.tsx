import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDb } from './lib/db';
import { initLogDb, log, LogLevel } from './lib/logger';

// Initialize databases when the app starts
Promise.all([initDb(), initLogDb()])
  .then(() => {
    log(LogLevel.INFO, 'System', 'Application initialized successfully');
  })
  .catch(error => {
    console.error('Failed to initialize databases:', error);
    log(LogLevel.ERROR, 'System', 'Failed to initialize application', error);
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);