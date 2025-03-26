
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useUserData, Crop, Task } from "@/services/userDataService";
import { Plus, Edit, Trash2, X, Check, AlertCircle } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

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
  
  // New crop/task states - Initialize with empty user_id that will be filled when adding
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // Initialize with dummy user_id that will be replaced when calling addCrop/addTask
  const [newCrop, setNewCrop] = useState<Omit<Crop, 'user_id'>>({ 
    crop_name: '', 
    status: 'growing' 
  });
  
  const [newTask, setNewTask] = useState<Omit<Task, 'user_id'>>({ 
    title: '', 
    status: 'pending', 
    description: '' 
  });
  
  // Edit states
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
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
  const handleAddCrop = async () => {
    if (!newCrop.crop_name.trim()) {
      toast({
        title: "Error",
        description: "Crop name is required",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addCrop(newCrop);
    if (result) {
      setCrops([...crops, result]);
      setShowAddCrop(false);
      setNewCrop({ crop_name: '', status: 'growing' });
    }
  };
  
  // Handle updating a crop
  const handleUpdateCrop = async () => {
    if (!editingCrop || !editingCrop.id) return;
    
    const result = await updateCrop(editingCrop.id, editingCrop);
    if (result) {
      setCrops(crops.map(crop => crop.id === result.id ? result : crop));
      setEditingCrop(null);
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
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addTask(newTask);
    if (result) {
      setTasks([...tasks, result]);
      setShowAddTask(false);
      setNewTask({ title: '', status: 'pending', description: '' });
    }
  };
  
  // Handle updating a task
  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.id) return;
    
    const result = await updateTask(editingTask.id, editingTask);
    if (result) {
      setTasks(tasks.map(task => task.id === result.id ? result : task));
      setEditingTask(null);
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
          {/* Add New Crop Form */}
          {showAddCrop ? (
            <Card className="p-4 border-gray-200 bg-gray-50">
              <h3 className="text-md font-medium mb-3">Add New Crop</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="crop-name">Crop Name</Label>
                  <Input 
                    id="crop-name" 
                    value={newCrop.crop_name}
                    onChange={(e) => setNewCrop({...newCrop, crop_name: e.target.value})}
                    placeholder="e.g., Wheat, Rice, Tomato"
                  />
                </div>
                
                <div>
                  <Label htmlFor="crop-status">Status</Label>
                  <Select 
                    value={newCrop.status} 
                    onValueChange={(value) => setNewCrop({...newCrop, status: value})}
                  >
                    <SelectTrigger id="crop-status">
                      <SelectValue placeholder="Select crop status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growing">Growing</SelectItem>
                      <SelectItem value="ready">Ready for Harvest</SelectItem>
                      <SelectItem value="harvested">Harvested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddCrop(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleAddCrop}
                  >
                    Add Crop
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowAddCrop(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Crop
            </Button>
          )}
          
          {/* Crop List */}
          <div className="space-y-2">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Loading crops...</p>
            ) : crops.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No crops added yet</p>
            ) : (
              crops.map(crop => (
                <Card key={crop.id} className="p-3 border-gray-200">
                  {editingCrop && editingCrop.id === crop.id ? (
                    <div className="space-y-3">
                      <Input 
                        value={editingCrop.crop_name}
                        onChange={(e) => setEditingCrop({...editingCrop, crop_name: e.target.value})}
                      />
                      <Select 
                        value={editingCrop.status} 
                        onValueChange={(value) => setEditingCrop({...editingCrop, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="growing">Growing</SelectItem>
                          <SelectItem value="ready">Ready for Harvest</SelectItem>
                          <SelectItem value="harvested">Harvested</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingCrop(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleUpdateCrop}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{crop.crop_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          crop.status === 'ready' 
                            ? 'bg-green-100 text-green-800' 
                            : crop.status === 'growing' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {crop.status === 'growing' ? 'Growing' : 
                           crop.status === 'ready' ? 'Ready for Harvest' : 'Harvested'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingCrop(crop)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeletingCrop(crop.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          {/* Add New Task Form */}
          {showAddTask ? (
            <Card className="p-4 border-gray-200 bg-gray-50">
              <h3 className="text-md font-medium mb-3">Add New Task</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input 
                    id="task-title" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g., Water crops, Apply fertilizer"
                  />
                </div>
                
                <div>
                  <Label htmlFor="task-description">Description (Optional)</Label>
                  <Input 
                    id="task-description" 
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Add details about this task"
                  />
                </div>
                
                <div>
                  <Label htmlFor="task-status">Status</Label>
                  <Select 
                    value={newTask.status} 
                    onValueChange={(value) => setNewTask({...newTask, status: value})}
                  >
                    <SelectTrigger id="task-status">
                      <SelectValue placeholder="Select task status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleAddTask}
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowAddTask(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          )}
          
          {/* Task List */}
          <div className="space-y-2">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No tasks added yet</p>
            ) : (
              tasks.map(task => (
                <Card key={task.id} className="p-3 border-gray-200">
                  {editingTask && editingTask.id === task.id ? (
                    <div className="space-y-3">
                      <Input 
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                      />
                      <Input 
                        value={editingTask.description || ''}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        placeholder="Description (optional)"
                      />
                      <Select 
                        value={editingTask.status} 
                        onValueChange={(value) => setEditingTask({...editingTask, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingTask(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleUpdateTask}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-gray-500">{task.description}</p>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'in-progress' 
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status === 'pending' ? 'Pending' : 
                           task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingTask(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeletingTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog for Crops */}
      <AlertDialog open={!!deletingCrop} onOpenChange={() => setDeletingCrop(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this crop and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCrop} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Confirmation Dialog for Tasks */}
      <AlertDialog open={!!deletingTask} onOpenChange={() => setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DataManagement;
