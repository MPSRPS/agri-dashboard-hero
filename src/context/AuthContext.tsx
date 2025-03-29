
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("krishiUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure the user ID is a valid UUID
        if (parsedUser && parsedUser.id) {
          // If the ID is numeric (like "1"), convert it to a valid UUID
          if (/^\d+$/.test(parsedUser.id)) {
            parsedUser.id = uuidv4();
            localStorage.setItem("krishiUser", JSON.stringify(parsedUser));
          }
        }
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("krishiUser");
      }
    }
    setIsLoading(false);
  }, []);
  
  // Login function with improved error handling
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      // Generate a proper UUID for the user
      const userId = uuidv4();
      
      // Create a user object with the provided email and a UUID
      const userData = {
        id: userId,
        name: email.split('@')[0], // Use part of email as name for demo
        email,
        avatar: "/lovable-uploads/a8aa18ab-a030-47a3-958e-48a63d870b2f.png"
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("krishiUser", JSON.stringify(userData));
      
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with improved validation
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!name.trim()) {
        throw new Error("Name is required");
      }
      
      if (!email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      // Generate a proper UUID for the user
      const userId = uuidv4();
      
      const userData = {
        id: userId,
        name,
        email,
        avatar: "/lovable-uploads/a8aa18ab-a030-47a3-958e-48a63d870b2f.png"
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("krishiUser", JSON.stringify(userData));
      
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("krishiUser");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
