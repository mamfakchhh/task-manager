import { User, Task, UserTask } from '../types';

const STORAGE_KEYS = {
  USERS: 'task_app_users',
  TASKS: 'task_app_tasks',
  USER_TASKS: 'task_app_user_tasks',
  CURRENT_USER: 'task_app_current_user',
};

const DEFAULT_MANAGER: User = {
  id: 'mgr-1',
  username: 'admin',
  passwordHash: 'admin123',
  role: 'MANAGER',
};

export const db = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      const initial = [DEFAULT_MANAGER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getUserTasks: (): UserTask[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveUserTasks: (userTasks: UserTask[]) => {
    localStorage.setItem(STORAGE_KEYS.USER_TASKS, JSON.stringify(userTasks));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
};
