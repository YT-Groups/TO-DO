
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full flex justify-between items-center py-6 px-4 sm:px-6 md:px-8 animate-slide-down">
      <div className="flex-1" />
      <h1 className="flex-1 text-center text-2xl font-bold tracking-tight">
        YT GROUPS To-Do
      </h1>
      <div className="flex-1 text-right">
        <p className="text-sm text-muted-foreground">
          {format(currentTime, 'EEEE, MMMM d')}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(currentTime, 'h:mm a')}
        </p>
      </div>
    </header>
  );
};

export default Header;
