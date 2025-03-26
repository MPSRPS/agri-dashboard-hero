
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export interface Crop {
  id?: string;
  crop_name: string;
  status: string;
  planted_date?: string | null;
  user_id: string; 
}

export interface Task {
  id?: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: string;
  user_id: string; 
}

// Helper function to ensure valid UUID
const ensureValidUuid = (id: string): string => {
  // If id is not a valid UUID (like "1"), generate a new one
  if (/^\d+$/.test(id)) {
    return uuidv4();
  }
  return id;
};

// Fetch user crops
export const fetchUserCrops = async (userId: string) => {
  try {
    // Ensure userId is a valid UUID
    const validUserId = ensureValidUuid(userId);
    
    const { data, error } = await supabase
      .from('user_crops')
      .select('*')
      .eq('user_id', validUserId);
    
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
    // Ensure userId is a valid UUID
    const validUserId = ensureValidUuid(userId);
    
    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', validUserId);
    
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
    // Ensure the user_id is a valid UUID
    const cropWithValidId = {
      ...crop,
      user_id: ensureValidUuid(crop.user_id)
    };
    
    const { data, error } = await supabase
      .from('user_crops')
      .insert(cropWithValidId)
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
    // Ensure the user_id is a valid UUID if it's included in updates
    const updatesWithValidId = updates.user_id 
      ? { ...updates, user_id: ensureValidUuid(updates.user_id) }
      : updates;
    
    const { data, error } = await supabase
      .from('user_crops')
      .update(updatesWithValidId)
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
    // Ensure the user_id is a valid UUID
    const taskWithValidId = {
      ...task,
      user_id: ensureValidUuid(task.user_id)
    };
    
    const { data, error } = await supabase
      .from('user_tasks')
      .insert(taskWithValidId)
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
    // Ensure the user_id is a valid UUID if it's included in updates
    const updatesWithValidId = updates.user_id 
      ? { ...updates, user_id: ensureValidUuid(updates.user_id) }
      : updates;
    
    const { data, error } = await supabase
      .from('user_tasks')
      .update(updatesWithValidId)
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
  
  const addUserCrop = async (crop: Omit<Crop, 'user_id'>) => {
    if (!user) return null;
    return addCrop({ ...crop, user_id: user.id });
  };
  
  const addUserTask = async (task: Omit<Task, 'user_id'>) => {
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
