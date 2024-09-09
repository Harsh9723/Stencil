import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './App.css'
import { TreeDataProvider } from './Context/TreedataContext.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <TreeDataProvider>
    <MemoryRouter>
      <App />
    </MemoryRouter>
    </TreeDataProvider>
  </React.StrictMode>
);

