
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';

import { 
  Task, 
  getFilteredTasks, 
  getSortedTasks, 
  useTaskStore 
} from '@/lib/store';

import TaskCard from './TaskCard';
import AddEditTaskDialog from './AddEditTaskDialog';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TaskList = () => {
  const { 
    tasks, 
    currentFilter, 
    sortBy, 
    searchQuery, 
    setSortBy, 
    setSearchQuery 
  } = useTaskStore();
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const filteredTasks = getFilteredTasks(tasks, currentFilter, searchQuery);
  const sortedTasks = getSortedTasks(filteredTasks, sortBy);
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleCloseDialog = () => {
    setEditingTask(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/30"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="btn-icon" aria-label="Sort options">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-dialog">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => setSortBy('dueDate')}
              className={sortBy === 'dueDate' ? 'bg-muted' : ''}
            >
              Due Date
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy('priority')}
              className={sortBy === 'priority' ? 'bg-muted' : ''}
            >
              Priority
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy('createdAt')}
              className={sortBy === 'createdAt' ? 'bg-muted' : ''}
            >
              Recently Added
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-1">
        <AnimatePresence>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask} 
              />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground animate-fade-in">
              {searchQuery ? (
                <p>No tasks found matching "{searchQuery}"</p>
              ) : currentFilter === 'completed' ? (
                <p>No completed tasks yet</p>
              ) : currentFilter === 'overdue' ? (
                <p>No overdue tasks</p>
              ) : (
                <p>No tasks yet. Add your first task!</p>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {editingTask && (
        <AddEditTaskDialog 
          task={editingTask} 
          isOpen={!!editingTask} 
          onClose={handleCloseDialog} 
        />
      )}
    </div>
  );
};

export default TaskList;
