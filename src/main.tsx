import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import './index.css';
import { initGA, trackPageView } from './services/googleAnalytics';

// Initialize Google Analytics with tracking ID from environment variable
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';
initGA(GA_TRACKING_ID);

// Component to track page views
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  
  return null;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PageTracker />
      <App />
    </BrowserRouter>
  </StrictMode>
);