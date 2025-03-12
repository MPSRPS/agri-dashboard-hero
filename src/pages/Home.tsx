
import { Link } from 'react-router-dom';
import { Leaf, Sun, CloudRain, Plant, LineChart, Sprout, BarChart3 } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

const Home = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-krishi-600" />
            <h1 className="text-2xl font-bold text-krishi-700">KrishiShakti</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-krishi-600 font-medium hover:text-krishi-700 transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-krishi-600 text-white font-medium rounded-md hover:bg-krishi-700 transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-krishi-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Empowering Farmers with Smart Technology Solutions
              </h1>
              <p className="text-lg text-gray-700">
                KrishiShakti helps farmers increase productivity, predict crop diseases, 
                and manage budgets efficiently with data-driven insights.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-krishi-600 text-white font-medium rounded-md hover:bg-krishi-700 transition-colors inline-flex items-center gap-2"
                >
                  Get Started
                  <Leaf className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-krishi-600 text-krishi-600 font-medium rounded-md hover:bg-krishi-50 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Farm illustration"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Discover how KrishiShakti can transform your farming practices with 
              intelligent analytics and personalized recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-krishi-100 rounded-full flex items-center justify-center mb-4">
                <Plant className="h-6 w-6 text-krishi-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Crop Recommendation</h3>
              <p className="text-gray-600">
                Get personalized crop recommendations based on soil composition, climate conditions, 
                and historical data to maximize yield.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-krishi-100 rounded-full flex items-center justify-center mb-4">
                <CloudRain className="h-6 w-6 text-krishi-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Disease Prediction</h3>
              <p className="text-gray-600">
                Identify plant diseases early using our advanced AI-powered image recognition system
                and receive treatment recommendations.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-krishi-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-krishi-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Budget Planning</h3>
              <p className="text-gray-600">
                Plan your farm budget effectively with our intelligent financial tools that
                help track expenses and forecast profitability.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-krishi-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farming?</h2>
          <p className="text-krishi-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using KrishiShakti to improve
            their productivity and profitability.
          </p>
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-krishi-600 font-medium rounded-md hover:bg-krishi-50 transition-colors inline-flex items-center gap-2"
          >
            Start for Free
            <Sprout className="h-4 w-4" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-krishi-500" />
                <h2 className="text-xl font-bold text-white">KrishiShakti</h2>
              </div>
              <p className="max-w-xs">
                Empowering farmers with smart technology and data-driven insights.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-medium mb-4">Features</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Crop Recommendation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Disease Prediction</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Budget Planning</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p>© {new Date().getFullYear()} KrishiShakti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
