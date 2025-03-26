
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/services/userDataService";

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'user_id'>) => Promise<void>;
  onCancel: () => void;
}

const TaskForm = ({ onAdd, onCancel }: TaskFormProps) => {
  const [newTask, setNewTask] = useState<Omit<Task, 'user_id'>>({ 
    title: '', 
    status: 'pending', 
    description: '' 
  });

  const handleSubmit = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    await onAdd(newTask);
    setNewTask({ title: '', status: 'pending', description: '' });
  };

  return (
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
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSubmit}
          >
            Add Task
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskForm;
