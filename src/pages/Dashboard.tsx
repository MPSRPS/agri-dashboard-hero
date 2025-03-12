
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Droplets, 
  BarChart, 
  Plus, 
  Newspaper,
  MapPin
} from "lucide-react";
import Chatbot from "@/components/Chatbot";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Extract first letter of user's name for avatar
  const userInitial = user?.name ? user.name.charAt(0) : "U";

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-krishi-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl font-semibold">
                {userInitial}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("welcome")}, {user?.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <LanguageSelector />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title={t("analyzing_crop_market")}
          percentage={82}
          color="#9333EA"
          gradientFrom="#8B5CF6"
          gradientTo="#C084FC"
          icon={<TrendingUp size={18} />}
        />
        <MetricCard
          title={t("monitoring_soil")}
          percentage={67}
          color="#F43F5E"
          gradientFrom="#FB7185"
          gradientTo="#FDA4AF"
          icon={<Droplets size={18} />}
        />
        <MetricCard
          title={t("tracking_resource")}
          percentage={45}
          color="#F59E0B"
          gradientFrom="#FBBF24"
          gradientTo="#FCD34D"
          icon={<BarChart size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 p-4 shadow-sm border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">{t("add_farm")}</h2>
            <Button size="sm" variant="outline" className="bg-white flex gap-1">
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </div>
          
          {/* Map component */}
          <div className="h-64 bg-gray-100 rounded-md overflow-hidden relative">
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=20.5937,78.9629&zoom=5&size=600x400&maptype=roadmap&key=DEMO_KEY"
              alt="Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <MapPin className="text-red-500" size={32} />
            </div>
          </div>
        </Card>

        <Card className="col-span-1 lg:col-span-2 shadow-sm border border-gray-200 bg-white overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">{t("agri_news")}</h2>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <Newspaper className="text-krishi-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Sustainable Farming Practices for Better Yield</h3>
                      <p className="text-sm text-gray-500">New research shows that incorporating sustainable farming techniques can increase crop yield by up to 30%.</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="market" className="p-4 space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <TrendingUp className="text-krishi-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Wheat Prices Set to Rise Due to Global Demand</h3>
                      <p className="text-sm text-gray-500">Market analysts predict a 15% increase in wheat prices due to increased global demand and reduced production.</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="p-4 space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <Droplets className="text-krishi-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Advanced Irrigation Techniques Workshop</h3>
                      <p className="text-sm text-gray-500">Join our online workshop on efficient irrigation systems to reduce water consumption while improving crop health.</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
