/**
 * React entry point - Initializes app rendering
 * Mounts the root component (App) to DOM
 * Not changed very often
*/

// Import core React libraries and styling
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';          // Main component
import './index.css';             // Global styles

// Create root DOM node connection (looks for <div id="root"> in HTML)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render application with strict mode checks
root.render(
  <React.StrictMode>   {/* Enables additional checks and warnings */}
    <App />            {/* Main application component */}
  </React.StrictMode>
);