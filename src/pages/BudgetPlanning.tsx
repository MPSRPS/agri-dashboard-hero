
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { 
  PlusCircle, 
  Trash2, 
  DollarSign, 
  CalendarRange, 
  BarChart3, 
  Download, 
  Clock,
  ChevronDown,
  Tractor,
  Droplets,
  Wheat
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types for budget items
interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const BudgetPlanning = () => {
  const { t } = useTranslation();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { 
      id: '1', 
      category: 'Crops', 
      description: 'Wheat Harvest', 
      amount: 3500, 
      date: '2023-05-15', 
      type: 'income' 
    },
    { 
      id: '2', 
      category: 'Livestock', 
      description: 'Milk Sales', 
      amount: 1200, 
      date: '2023-05-20', 
      type: 'income' 
    },
    { 
      id: '3', 
      category: 'Seeds', 
      description: 'Corn Seeds', 
      amount: 500, 
      date: '2023-04-10', 
      type: 'expense' 
    },
    { 
      id: '4', 
      category: 'Fertilizer', 
      description: 'NPK Fertilizer', 
      amount: 800, 
      date: '2023-04-15', 
      type: 'expense' 
    },
    { 
      id: '5', 
      category: 'Equipment', 
      description: 'Irrigation System', 
      amount: 1500, 
      date: '2023-03-30', 
      type: 'expense' 
    },
    { 
      id: '6', 
      category: 'Labor', 
      description: 'Seasonal Workers', 
      amount: 1200, 
      date: '2023-05-01', 
      type: 'expense' 
    }
  ]);
  
  const [newItem, setNewItem] = useState<Omit<BudgetItem, 'id'>>({
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const categoryOptions = [
    { value: 'Crops', label: 'Crops' },
    { value: 'Livestock', label: 'Livestock' },
    { value: 'Seeds', label: 'Seeds' },
    { value: 'Fertilizer', label: 'Fertilizer' },
    { value: 'Pesticides', label: 'Pesticides' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Labor', label: 'Labor' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Rent', label: 'Rent/Lease' },
    { value: 'Others', label: 'Others' }
  ];

  const handleAddItem = () => {
    if (!newItem.category || !newItem.description || newItem.amount <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }
    
    const item: BudgetItem = {
      ...newItem,
      id: Date.now().toString()
    };
    
    setBudgetItems([...budgetItems, item]);
    
    // Reset form
    setNewItem({
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
  };

  const handleDeleteItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const totalIncome = budgetItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = budgetItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netBalance = totalIncome - totalExpenses;

  // Data for charts
  const categoryExpenseData = Object.entries(
    budgetItems
      .filter(item => item.type === 'expense')
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    return {
      month,
      income: 0,
      expenses: 0
    };
  });

  // Fill monthly data
  budgetItems.forEach(item => {
    const date = new Date(item.date);
    const monthIndex = date.getMonth();
    
    if (item.type === 'income') {
      monthlyData[monthIndex].income += item.amount;
    } else {
      monthlyData[monthIndex].expenses += item.amount;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('budgetPlanning')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track farm expenses, income, and plan your agricultural budget effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <h3 className="text-2xl font-bold text-gray-900">${totalIncome.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <h3 className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
          
          <Card className={`p-6 border-l-4 ${netBalance >= 0 ? 'border-l-blue-500' : 'border-l-amber-500'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <h3 className="text-2xl font-bold text-gray-900">${netBalance.toLocaleString()}</h3>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                netBalance >= 0 ? 'bg-blue-100' : 'bg-amber-100'
              }`}>
                <BarChart3 className={`h-6 w-6 ${
                  netBalance >= 0 ? 'text-blue-600' : 'text-amber-600'
                }`} />
              </div>
            </div>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="add">Add Transaction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Monthly Overview</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span>Income</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span>Expenses</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                      <Legend />
                      <Bar dataKey="income" fill="#22c55e" name="Income" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Expense Breakdown</h3>
                  <Select defaultValue="current">
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Year</SelectItem>
                      <SelectItem value="last">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="h-80 flex items-center justify-center">
                  {categoryExpenseData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryExpenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {categoryExpenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-gray-500">No expense data available</div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Budget Calendar</h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <CalendarRange className="h-4 w-4" />
                    <span>View Full Calendar</span>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-500">Upcoming Transactions</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Droplets className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Water Bill Payment</p>
                          <p className="text-sm text-gray-500">May 30, 2023</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">-$250.00</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Tractor className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">Equipment Maintenance</p>
                          <p className="text-sm text-gray-500">June 5, 2023</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">-$350.00</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Wheat className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Corn Harvest Sale</p>
                          <p className="text-sm text-gray-500">June 10, 2023</p>
                        </div>
                      </div>
                      <p className="font-medium text-green-600">+$2,500.00</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              item.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span>{item.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          item.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Add New Transaction</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction Type
                    </label>
                    <div className="flex rounded-md overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        className={`flex-1 py-2 px-4 text-center ${
                          newItem.type === 'income' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setNewItem({...newItem, type: 'income'})}
                      >
                        Income
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-4 text-center ${
                          newItem.type === 'expense' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setNewItem({...newItem, type: 'expense'})}
                      >
                        Expense
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <Select 
                      value={newItem.category} 
                      onValueChange={(value) => setNewItem({...newItem, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      value={newItem.amount || ''}
                      onChange={(e) => setNewItem({...newItem, amount: Number(e.target.value)})}
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={newItem.date}
                      onChange={(e) => setNewItem({...newItem, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleAddItem}
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BudgetPlanning;
