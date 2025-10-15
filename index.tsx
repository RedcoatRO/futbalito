
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Add .tsx extension to module import to resolve module resolution error.
import App from './App.tsx';
import { CompetitionProvider } from './context/CompetitionContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CompetitionProvider>
      <App />
    </CompetitionProvider>
  </React.StrictMode>,
);
