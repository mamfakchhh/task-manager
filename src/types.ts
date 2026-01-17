export type Role = 'USER' | 'MANAGER';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
}

export interface Task {
  id: string;
  designation: string;
}

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface UserTask {
  id: string;
  userId: string;
  taskId: string;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
  status: TaskStatus;
  notes?: string;
  updatedAt: string; // ISO string
}

export interface UserTaskWithDetails extends UserTask {
  taskDesignation: string;
  username: string;
}

export interface GlobalTaskStats {
  taskId: string;
  designation: string;
  totalAssigned: number;
  completedCount: number;
  progressPercentage: number;
}
