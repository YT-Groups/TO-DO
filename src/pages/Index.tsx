
import { useEffect, useRef } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Header from '@/components/layout/Header';
import TaskTabs from '@/components/layout/TaskTabs';
import TaskList from '@/components/tasks/TaskList';
import AddTaskButton from '@/components/tasks/AddTaskButton';
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = containerRef.current?.querySelectorAll('.animate-on-scroll');
    animatedElements?.forEach((el) => observer.observe(el));

    return () => {
      animatedElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <ThemeProvider>
      <div
        ref={containerRef}
        className="min-h-screen bg-background text-foreground flex flex-col"
      >
        <Header />
        
        <main className="flex-1 pb-20">
          <div className="animate-on-scroll">
            <Dashboard />
          </div>
          
          <div className="animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <TaskTabs />
            <TaskList />
          </div>
        </main>
        
        <AddTaskButton />
      </div>
    </ThemeProvider>
  );
};

export default Index;
