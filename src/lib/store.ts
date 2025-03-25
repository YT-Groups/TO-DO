import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "all" | "completed" | "overdue";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  category: string;
}

interface TaskStore {
  tasks: Task[];
  currentFilter: TaskStatus;
  sortBy: "dueDate" | "priority" | "createdAt";
  searchQuery: string;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  initializeStore: () => void;
  toggleCompleted: (id: string) => void;
  setFilter: (filter: TaskStatus) => void;
  setSortBy: (sortBy: "dueDate" | "priority" | "createdAt") => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      currentFilter: "all",
      sortBy: "dueDate",
      searchQuery: "",
      addTask: async (task) => {
        const newTask = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };

        const { error } = await supabase.from("tasks").insert({
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          due_date: newTask.dueDate,
          priority: newTask.priority,
          completed: newTask.completed,
          created_at: newTask.createdAt,
          category: newTask.category,
        });

        if (!error) {
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } else {
          console.error("Error adding task:", error);
        }
      },

      updateTask: async (id, updatedTask) => {
        const { error } = await supabase
          .from("tasks")
          .update({
            title: updatedTask.title,
            description: updatedTask.description || undefined,
            priority: updatedTask.priority,
            category: updatedTask.category,
            due_date: updatedTask.dueDate,
            created_at: updatedTask.createdAt,
          })
          .eq("id", id);

        if (!error) {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updatedTask } : task
            ),
          }));
        } else {
          console.error("Error updatiing task:", error);
        }
      },

      deleteTask: async (id) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id);

        if (!error) {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        }
      },

      initializeStore: async () => {
        const { data, error } = await supabase.from("tasks").select("*");

        if (!error) {
          const transformedData = data.map((task) => ({
            ...task,
            dueDate: task.due_date ? new Date(task.due_date) : undefined,
            createdAt: new Date(task.created_at),
            due_date: undefined,
            created_at: undefined,
          })) as Task[];

          set({ tasks: transformedData });
        } else {
          console.error("Error initializing store:", error);
        }
      },

      toggleCompleted: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      setFilter: (filter) => set({ currentFilter: filter }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: "yt-tasks-storage",
    }
  )
);

// Helper functions to get filtered and sorted tasks
export const getFilteredTasks = (
  tasks: Task[],
  filter: TaskStatus,
  searchQuery: string
) => {
  let filteredTasks = [...tasks];

  // Apply status filter
  if (filter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filter === "overdue") {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    );
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
    );
  }

  return filteredTasks;
};

export const getSortedTasks = (
  tasks: Task[],
  sortBy: "dueDate" | "priority" | "createdAt"
) => {
  const sortedTasks = [...tasks];

  if (sortBy === "dueDate") {
    return sortedTasks.sort((a, b) => {
      // Tasks without due dates go to the bottom
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  } else if (sortBy === "priority") {
    const priorityValue = {
      high: 0,
      medium: 1,
      low: 2,
    };
    return sortedTasks.sort(
      (a, b) => priorityValue[a.priority] - priorityValue[b.priority]
    );
  } else {
    // Sort by creation date (newest first)
    return sortedTasks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};

// Task statistics
export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(
    (task) =>
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate,
  };
};
