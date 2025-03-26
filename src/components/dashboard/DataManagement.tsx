
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUserData, Crop, Task } from "@/services/userDataService";
import { useAuth } from '@/context/AuthContext';
import CropsList from './data-management/CropsList';
import TasksList from './data-management/TasksList';
import DeleteConfirmDialog from './data-management/DeleteConfirmDialog';

const DataManagement = () => {
  const { user } = useAuth();
  const {
    fetchUserCrops,
    fetchUserTasks,
    addCrop,
    updateCrop,
    deleteCrop,
    addTask,
    updateTask,
    deleteTask
  } = useUserData();
  
  const [crops, setCrops] = useState<Crop[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("crops");
  
  // Add state management
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // Delete dialog states
  const [deletingCrop, setDeletingCrop] = useState<string | null>(null);
  const [deletingTask, setDeletingTask] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      setLoading(true);
      
      try {
        const [cropsData, tasksData] = await Promise.all([
          fetchUserCrops(),
          fetchUserTasks()
        ]);
        
        setCrops(cropsData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  // Handle adding a new crop
  const handleAddCrop = async (newCrop: Omit<Crop, 'user_id'>) => {
    const result = await addCrop(newCrop);
    if (result) {
      setCrops([...crops, result]);
      setShowAddCrop(false);
    }
  };
  
  // Handle updating a crop
  const handleUpdateCrop = async (updatedCrop: Crop) => {
    if (!updatedCrop.id) return;
    
    const result = await updateCrop(updatedCrop.id, updatedCrop);
    if (result) {
      setCrops(crops.map(crop => crop.id === result.id ? result : crop));
    }
  };
  
  // Handle deleting a crop
  const handleDeleteCrop = async () => {
    if (!deletingCrop) return;
    
    const success = await deleteCrop(deletingCrop);
    if (success) {
      setCrops(crops.filter(crop => crop.id !== deletingCrop));
      setDeletingCrop(null);
    }
  };
  
  // Handle adding a new task
  const handleAddTask = async (newTask: Omit<Task, 'user_id'>) => {
    const result = await addTask(newTask);
    if (result) {
      setTasks([...tasks, result]);
      setShowAddTask(false);
    }
  };
  
  // Handle updating a task
  const handleUpdateTask = async (updatedTask: Task) => {
    if (!updatedTask.id) return;
    
    const result = await updateTask(updatedTask.id, updatedTask);
    if (result) {
      setTasks(tasks.map(task => task.id === result.id ? result : task));
    }
  };
  
  // Handle deleting a task
  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    
    const success = await deleteTask(deletingTask);
    if (success) {
      setTasks(tasks.filter(task => task.id !== deletingTask));
      setDeletingTask(null);
    }
  };
  
  if (!user) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-5 w-5" />
          <p>Please log in to manage your data</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Manage Your Farm Data</h2>
        <p className="text-sm text-gray-500">Add and manage your crops and tasks</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="crops" className="space-y-4">
          <CropsList 
            crops={crops}
            loading={loading}
            showAddCrop={showAddCrop}
            setShowAddCrop={setShowAddCrop}
            handleAddCrop={handleAddCrop}
            handleUpdateCrop={handleUpdateCrop}
            setDeletingCrop={setDeletingCrop}
          />
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <TasksList
            tasks={tasks}
            loading={loading}
            showAddTask={showAddTask}
            setShowAddTask={setShowAddTask}
            handleAddTask={handleAddTask}
            handleUpdateTask={handleUpdateTask}
            setDeletingTask={setDeletingTask}
          />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmDialog
        isOpen={!!deletingCrop}
        title="Are you sure?"
        description="This will permanently delete this crop and cannot be undone."
        onCancel={() => setDeletingCrop(null)}
        onConfirm={handleDeleteCrop}
      />
      
      <DeleteConfirmDialog
        isOpen={!!deletingTask}
        title="Are you sure?"
        description="This will permanently delete this task and cannot be undone."
        onCancel={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
      />
    </Card>
  );
};

export default DataManagement;
