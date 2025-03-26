
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, X, Check } from "lucide-react";
import { Task } from "@/services/userDataService";

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => Promise<void>;
  onDelete: (taskId: string) => void;
}

const TaskItem = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>(task);

  const handleUpdate = async () => {
    await onUpdate(editingTask);
    setIsEditing(false);
  };

  return (
    <Card key={task.id} className="p-3 border-gray-200">
      {isEditing ? (
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
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleUpdate}
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
              onClick={() => {
                setEditingTask(task);
                setIsEditing(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(task.id!)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskItem;
