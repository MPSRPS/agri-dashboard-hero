
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import DiseasePrediction from "./pages/DiseasePrediction";
import BudgetPlanning from "./pages/BudgetPlanning";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Ensure only one session is active at a time
  useEffect(() => {
    // Listen for storage events (when localStorage changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'krishiUser') {
        // If user data changed in another tab, reload this tab to sync state
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/crop-recommendation" element={
                  <ProtectedRoute>
                    <CropRecommendation />
                  </ProtectedRoute>
                } />
                <Route path="/disease-prediction" element={
                  <ProtectedRoute>
                    <DiseasePrediction />
                  </ProtectedRoute>
                } />
                <Route path="/budget-planning" element={
                  <ProtectedRoute>
                    <BudgetPlanning />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
