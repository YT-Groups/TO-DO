
import { CheckCircle, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { getTaskStats, useTaskStore } from '@/lib/store';
import StatCard from './StatCard';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { tasks } = useTaskStore();
  const stats = getTaskStats(tasks);
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-10 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Tasks" 
          value={stats.total}
          icon={<ListTodo className="h-4 w-4" />}
        />
        <StatCard 
          title="Completed" 
          value={stats.completed}
          icon={<CheckCircle className="h-4 w-4" />}
          footer={
            stats.total > 0 
              ? `${stats.completionRate}% completion rate` 
              : undefined
          }
        />
        <StatCard 
          title="Pending" 
          value={stats.pending}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Task Completion</h3>
          <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-2 bg-muted" />
      </div>
    </div>
  );
};

export default Dashboard;
