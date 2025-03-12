
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sprout, 
  FileSearch, 
  Calculator, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ icon, label, to, isCollapsed }: SidebarLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full flex items-center justify-start gap-3 px-4 py-2 h-10 text-base font-medium transition-all duration-200",
        isCollapsed ? "justify-center px-2" : "justify-start",
        isActive ? "bg-krishi-100 text-krishi-800" : "text-gray-600 hover:bg-krishi-50 hover:text-krishi-700"
      )}
      onClick={() => navigate(to)}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Button>
  );
};

const Sidebar = () => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Set collapsed state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-krishi-500 flex items-center justify-center">
          <Sprout className="text-white" size={18} />
        </div>
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-gray-900">KrishiShakti</h1>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <SidebarLink
          icon={<Home size={20} />}
          label={t("home")}
          to="/"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={<LayoutDashboard size={20} />}
          label={t("dashboard")}
          to="/dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={<Sprout size={20} />}
          label={t("crop_recommendation")}
          to="/crop-recommendation"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={<FileSearch size={20} />}
          label={t("disease_prediction")}
          to="/disease-prediction"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={<Calculator size={20} />}
          label={t("budget_planning")}
          to="/budget-planning"
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 h-10 text-base font-medium transition-colors",
            isCollapsed ? "justify-center px-2" : "justify-start",
            "text-gray-600 hover:bg-red-50 hover:text-red-700"
          )}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>{t("logout")}</span>}
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-100 z-10 h-6 w-6"
      >
        {isCollapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
