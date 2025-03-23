
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useState } from 'react';
import { Trash, Pencil, AlertCircle } from 'lucide-react';
import { Task, useTaskStore } from '@/lib/store';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { toggleCompleted, deleteTask } = useTaskStore();
  const [isHovering, setIsHovering] = useState(false);
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  const priorityClass = 
    task.priority === 'high' 
      ? 'priority-high' 
      : task.priority === 'medium'
        ? 'priority-medium'
        : 'priority-low';
        
  const cardClass = `
    group relative flex items-start gap-2 rounded-md p-3 mb-3
    ${task.completed ? 'task-completed' : ''}
    ${isOverdue ? 'task-overdue' : 'bg-secondary'}
    ${priorityClass}
    hover-lift
  `;

  return (
    <motion.div
      className={cardClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      layout
      layoutId={task.id}
    >
      <div className="pt-0.5">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => toggleCompleted(task.id)}
          className="rounded-sm border-white/60"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium text-base ${task.completed ? 'line-through opacity-70' : ''}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-1">
              {task.category && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {task.category}
                </span>
              )}
              
              {task.dueDate && (
                <span className={`text-xs ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  {isOverdue && !task.completed && (
                    <AlertCircle className="inline-block w-3 h-3 mr-1" />
                  )}
                  {format(new Date(task.dueDate), 'MMM d')}
                </span>
              )}
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <motion.div 
        className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
      >
        <button 
          onClick={() => onEdit(task)} 
          className="btn-icon"
          aria-label="Edit task"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => deleteTask(task.id)} 
          className="btn-icon text-destructive"
          aria-label="Delete task"
        >
          <Trash className="w-4 h-4" />
        </button>
      </motion.div>
      
      {task.priority === 'high' && !task.completed && (
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white transform translate-x-1/2 -translate-y-1/2" />
      )}
    </motion.div>
  );
};

export default TaskCard;
