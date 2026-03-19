// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
  throw new Error('Root element not found. Check your index.html file.');
}

// Create React root and render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);