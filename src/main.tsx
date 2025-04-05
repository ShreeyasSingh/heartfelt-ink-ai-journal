
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// PublishableKey - We'll use a dummy key if not available in env
// In production, this should be replaced with a real key from Clerk dashboard
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dummy-key-for-development';

// Only show warning in development, not in production
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn('⚠️ Missing Clerk Publishable Key - Authentication features will not work correctly until you add your publishable key. Get it from https://dashboard.clerk.com/last-active?path=api-keys');
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
