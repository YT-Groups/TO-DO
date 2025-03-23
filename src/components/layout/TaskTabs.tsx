
import { motion } from 'framer-motion';
import { TaskStatus, useTaskStore } from '@/lib/store';

const TaskTabs = () => {
  const { currentFilter, setFilter } = useTaskStore();

  const tabs: { value: TaskStatus; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return (
    <div className="w-full border-b border-border mb-6">
      <div className="flex space-x-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`tab relative ${currentFilter === tab.value ? 'active' : ''}`}
          >
            {tab.label}
            {currentFilter === tab.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskTabs;
