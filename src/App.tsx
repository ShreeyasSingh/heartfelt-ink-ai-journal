
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  ClerkLoaded, 
  ClerkLoading, 
  SignedIn, 
  SignedOut 
} from '@clerk/clerk-react';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import JournalEntry from "./pages/JournalEntry";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PublishedEntry from "./pages/PublishedEntry";
import Social from "./pages/Social";
import { Spinner } from "./components/ui/spinner";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClerkLoading>
          <div className="flex items-center justify-center min-h-screen">
            <Spinner size="lg" />
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              }
            />
            <Route
              path="/social"
              element={
                <SignedIn>
                  <Social />
                </SignedIn>
              }
            />
            <Route
              path="/journal/new"
              element={
                <SignedIn>
                  <JournalEntry />
                </SignedIn>
              }
            />
            <Route
              path="/journal/:id"
              element={
                <SignedIn>
                  <JournalEntry />
                </SignedIn>
              }
            />
            <Route
              path="/settings"
              element={
                <SignedIn>
                  <Settings />
                </SignedIn>
              }
            />
            <Route path="/entry/:id" element={<PublishedEntry />} />
            <Route
              path="/sign-in/*"
              element={
                <SignedOut>
                  <Auth type="sign-in" />
                </SignedOut>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <SignedOut>
                  <Auth type="sign-up" />
                </SignedOut>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
