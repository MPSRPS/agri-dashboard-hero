
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  BarChart3, 
  Droplets, 
  Thermometer, 
  Wind, 
  CloudRain, 
  Send,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ text: string; isBot: boolean }[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatMessages([...chatMessages, { text: message, isBot: false }]);
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          text: "I'm your KrishiBot assistant. How can I help you with your farming needs today?", 
          isBot: true 
        }
      ]);
    }, 1000);
    
    setMessage('');
  };

  // Mock data for charts
  const temperatureData = [
    { name: '6AM', value: 22 },
    { name: '9AM', value: 24 },
    { name: '12PM', value: 28 },
    { name: '3PM', value: 30 },
    { name: '6PM', value: 27 },
    { name: '9PM', value: 25 },
  ];

  const weeklyWeatherData = [
    { day: 'Mon', temp: 28, rain: 10 },
    { day: 'Tue', temp: 29, rain: 20 },
    { day: 'Wed', temp: 27, rain: 30 },
    { day: 'Thu', temp: 26, rain: 15 },
    { day: 'Fri', temp: 29, rain: 5 },
    { day: 'Sat', temp: 30, rain: 0 },
    { day: 'Sun', temp: 28, rain: 12 },
  ];

  const waterConsumptionData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1400 },
    { name: 'Mar', value: 1800 },
    { name: 'Apr', value: 2200 },
    { name: 'May', value: 2600 },
    { name: 'Jun', value: 2400 },
  ];

  const financeData = [
    { name: 'Jan', revenue: 5000, expenses: 3000 },
    { name: 'Feb', revenue: 4500, expenses: 3200 },
    { name: 'Mar', revenue: 6000, expenses: 3500 },
    { name: 'Apr', revenue: 7000, expenses: 4000 },
    { name: 'May', revenue: 8500, expenses: 4200 },
    { name: 'Jun', revenue: 9000, expenses: 4500 },
  ];

  const cropHealthData = [
    { name: 'Healthy', value: 70 },
    { name: 'At Risk', value: 20 },
    { name: 'Unhealthy', value: 10 },
  ];

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('welcome')}, Pranav
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-4 bg-krishi-50 border-krishi-100">
            <div className="h-12 w-12 bg-krishi-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-krishi-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('totalCrops')}</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center gap-4 bg-soil-50 border-soil-100">
            <div className="h-12 w-12 bg-soil-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-soil-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('harvestReady')}</p>
              <h3 className="text-2xl font-bold text-gray-800">4</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center gap-4 bg-water-50 border-water-100">
            <div className="h-12 w-12 bg-water-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-water-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('pendingTasks')}</p>
              <h3 className="text-2xl font-bold text-gray-800">8</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center gap-4 bg-growth-50 border-growth-100">
            <div className="h-12 w-12 bg-growth-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-growth-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('completedTasks')}</p>
              <h3 className="text-2xl font-bold text-gray-800">16</h3>
            </div>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Environmental Data */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    {t('temperature')}
                  </h3>
                  <span className="text-xl font-bold text-orange-500">28°C</span>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={temperatureData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ED8936" 
                      strokeWidth={2} 
                      dot={{ r: 0 }}
                      activeDot={{ r: 4 }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}°C`, 'Temperature']}
                      contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              
              <Card className="p-4 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    {t('soilMoisture')}
                  </h3>
                  <span className="text-xl font-bold text-blue-500">65%</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: '65%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span className="font-medium text-blue-500">65%</span>
                  <span>100%</span>
                </div>
              </Card>
            </div>
            
            <Card className="p-4 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">{t('weatherForecast')}</h3>
                <span className="text-sm text-gray-500">{t('nextSevenDays')}</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyWeatherData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="temp" name="Temp (°C)" fill="#ED8936" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="rain" name="Rain (mm)" fill="#4299E1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">{t('cropHealth')}</h3>
                </div>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={cropHealthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {cropHealthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value}%`, name]}
                        contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {cropHealthData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-xs text-gray-600">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">{t('waterConsumption')}</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={waterConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} L`, 'Water Usage']}
                      contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4299E1" 
                      fill="#BEE3F8" 
                      fillOpacity={0.8} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
            
            <Card className="p-4 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  {t('farmIncome')}
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name={t('revenue')} fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name={t('expenses')} fill="#F56565" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          
          {/* Right Column - Chatbot */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">{t('chatbot')}</h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 bg-krishi-100 rounded-full flex items-center justify-center mb-4">
                      <Send className="h-8 w-8 text-krishi-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">KrishiBot Assistant</h3>
                    <p className="text-gray-500 mt-2">
                      Ask me anything about crop recommendations, disease identification, or budget planning.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        msg.isBot
                          ? 'bg-gray-100 text-gray-800 self-start'
                          : 'bg-krishi-600 text-white self-end ml-auto'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('chatbotPlaceholder')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-krishi-600 text-white rounded-md hover:bg-krishi-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
