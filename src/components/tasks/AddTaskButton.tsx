
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import AddEditTaskDialog from './AddEditTaskDialog';

const AddTaskButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDialogOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
      
      <AddEditTaskDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
};

export default AddTaskButton;
