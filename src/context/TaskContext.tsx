import React, { createContext, useContext, ReactNode } from 'react';
import { useTaskApp } from '../hooks/useTaskApp';

type TaskContextType = ReturnType<typeof useTaskApp>;

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskApp = useTaskApp();
  return (
    <TaskContext.Provider value={taskApp}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
