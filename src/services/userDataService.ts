
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface Crop {
  id?: string;
  crop_name: string;
  status: string;
  planted_date?: string | null;
  user_id?: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: string;
  user_id?: string;
}

// Fetch user crops
export const fetchUserCrops = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_crops')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user crops:', error);
    return [];
  }
};

// Fetch user tasks
export const fetchUserTasks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return [];
  }
};

// Add a new crop
export const addCrop = async (crop: Crop) => {
  try {
    const { data, error } = await supabase
      .from('user_crops')
      .insert(crop)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Crop Added",
      description: `${crop.crop_name} has been added successfully.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error adding crop:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Update a crop
export const updateCrop = async (id: string, updates: Partial<Crop>) => {
  try {
    const { data, error } = await supabase
      .from('user_crops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Crop Updated",
      description: `Crop has been updated successfully.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error updating crop:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Delete a crop
export const deleteCrop = async (id: string) => {
  try {
    const { error } = await supabase
      .from('user_crops')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Crop Deleted",
      description: "Crop has been deleted successfully.",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting crop:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Add a new task
export const addTask = async (task: Task) => {
  try {
    const { data, error } = await supabase
      .from('user_tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Task Added",
      description: `${task.title} has been added successfully.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error adding task:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Update a task
export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    const { data, error } = await supabase
      .from('user_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Task Updated",
      description: `Task has been updated successfully.`,
    });
    
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Delete a task
export const deleteTask = async (id: string) => {
  try {
    const { error } = await supabase
      .from('user_tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Task Deleted",
      description: "Task has been deleted successfully.",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Hook for managing user data
export const useUserData = () => {
  const { user } = useAuth();
  
  const addUserCrop = async (crop: Crop) => {
    if (!user) return null;
    return addCrop({ ...crop, user_id: user.id });
  };
  
  const addUserTask = async (task: Task) => {
    if (!user) return null;
    return addTask({ ...task, user_id: user.id });
  };
  
  return {
    fetchUserCrops: () => user ? fetchUserCrops(user.id) : Promise.resolve([]),
    fetchUserTasks: () => user ? fetchUserTasks(user.id) : Promise.resolve([]),
    addCrop: addUserCrop,
    updateCrop,
    deleteCrop,
    addTask: addUserTask,
    updateTask,
    deleteTask
  };
};
