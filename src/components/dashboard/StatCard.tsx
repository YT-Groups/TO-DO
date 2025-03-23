
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  footer?: ReactNode;
}

const StatCard = ({ title, value, icon, footer }: StatCardProps) => {
  return (
    <motion.div
      className="rounded-lg glass p-4 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.1 } }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {footer && <div className="mt-2 text-xs text-muted-foreground">{footer}</div>}
    </motion.div>
  );
};

export default StatCard;
