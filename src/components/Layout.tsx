
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={cn("flex min-h-screen bg-gray-50")}>
      {isAuthenticated && <Sidebar />}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isAuthenticated ? "ml-0" : "ml-0"
        )}
      >
        <div className="p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
