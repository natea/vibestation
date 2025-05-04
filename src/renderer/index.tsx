import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log when the app has loaded
console.log('Vibestation app loaded');