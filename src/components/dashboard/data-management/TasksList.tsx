
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Task } from "@/services/userDataService";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

interface TasksListProps {
  tasks: Task[];
  loading: boolean;
  showAddTask: boolean;
  setShowAddTask: (show: boolean) => void;
  handleAddTask: (task: Omit<Task, 'user_id'>) => Promise<void>;
  handleUpdateTask: (updatedTask: Task) => Promise<void>;
  setDeletingTask: (taskId: string) => void;
}

const TasksList = ({ 
  tasks, 
  loading, 
  showAddTask, 
  setShowAddTask, 
  handleAddTask, 
  handleUpdateTask,
  setDeletingTask 
}: TasksListProps) => {
  return (
    <div className="space-y-4">
      {/* Add New Task Form */}
      {showAddTask ? (
        <TaskForm 
          onAdd={handleAddTask}
          onCancel={() => setShowAddTask(false)}
        />
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
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={handleUpdateTask}
              onDelete={setDeletingTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TasksList;
