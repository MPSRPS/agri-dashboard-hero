
import { createClient } from '@supabase/supabase-js';

// These values should be set in environment variables in a production app
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (error) throw error;
  
  // If signup is successful, create a user profile record
  if (data.user) {
    await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        name,
        email,
        created_at: new Date().toISOString(),
      });
  }
  
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get the user profile with additional data
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.name || 'User',
    avatar: profile?.avatar_url,
  };
};

// Helper functions for budget data
export const getBudgetItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const addBudgetItem = async (userId: string, item: any) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert({
      ...item,
      user_id: userId,
    })
    .select();
    
  if (error) throw error;
  return data;
};

export const deleteBudgetItem = async (id: string) => {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Helper functions for dashboard data
export const getDashboardData = async (userId: string) => {
  // Get crop count
  const { data: crops, error: cropsError } = await supabase
    .from('crops')
    .select('id')
    .eq('user_id', userId);
    
  if (cropsError) throw cropsError;
  
  // Get harvest ready count
  const { data: harvestReady, error: harvestError } = await supabase
    .from('crops')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'harvest_ready');
    
  if (harvestError) throw harvestError;
  
  // Get pending tasks
  const { data: pendingTasks, error: pendingError } = await supabase
    .from('tasks')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'pending');
    
  if (pendingError) throw pendingError;
  
  // Get completed tasks
  const { data: completedTasks, error: completedError } = await supabase
    .from('tasks')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed');
    
  if (completedError) throw completedError;
  
  return {
    totalCrops: crops?.length || 0,
    harvestReady: harvestReady?.length || 0,
    pendingTasks: pendingTasks?.length || 0,
    completedTasks: completedTasks?.length || 0,
  };
};
