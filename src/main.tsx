
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Clerk PublishableKey
const PUBLISHABLE_KEY = 'pk_test_ZmFjdHVhbC1jYXQtNzQuY2xlcmsuYWNjb3VudHMuZGV2JA';

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
