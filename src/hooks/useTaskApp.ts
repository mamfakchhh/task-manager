import { useState, useEffect, useCallback, useMemo } from "react";
import {
  User,
  Task,
  UserTask,
  UserTaskWithDetails,
  TaskStatus,
  GlobalTaskStats,
} from "../types";
import { authAPI, usersAPI, tasksAPI, userTasksAPI } from "../lib/api";

export function useTaskApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("task_app_token");
    const savedUser = localStorage.getItem("task_app_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      loadData(savedToken);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const loadData = useCallback(async (authToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load tasks
      const tasksData = await tasksAPI.getAll(authToken);
      setTasks(tasksData);

      // Load user tasks
      const userTasksData = await userTasksAPI.getAllTasks(authToken);
      setUserTasks(
        userTasksData.map((ut: any) => ({
          id: ut.id,
          userId: ut.user_id,
          taskId: ut.task_id,
          startDate: ut.start_date,
          endDate: ut.end_date,
          status: ut.status,
          notes: ut.notes,
          updatedAt: ut.updated_at,
        })),
      );

      // Load users (if manager)
      try {
        const usersData = await usersAPI.getAll(authToken);
        setUsers(usersData);
      } catch {
        // Non-managers can't fetch all users
        setUsers([]);
      }

      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await authAPI.login(username, password);
        const authToken = response.token;
        const user = response.user;

        // Convert to our User type
        const mappedUser: User = {
          id: user.id,
          username: user.username,
          passwordHash: password, // Store for reference
          role: user.role as "USER" | "MANAGER",
        };

        setToken(authToken);
        setCurrentUser(mappedUser);
        localStorage.setItem("task_app_token", authToken);
        localStorage.setItem("task_app_user", JSON.stringify(mappedUser));

        await loadData(authToken);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loadData],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    setUsers([]);
    setTasks([]);
    setUserTasks([]);
    localStorage.removeItem("task_app_token");
    localStorage.removeItem("task_app_user");
  }, []);

  const userTasksWithDetails = useMemo((): UserTaskWithDetails[] => {
    if (!isInitialized) return [];

    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const userMap = new Map(users.map((u) => [u.id, u]));

    return userTasks
      .map((ut) => ({
        ...ut,
        taskDesignation:
          taskMap.get(ut.taskId)?.designation || "Tâche supprimée",
        username: userMap.get(ut.userId)?.username || "Utilisateur inconnu",
      }))
      .sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [userTasks, tasks, users, isInitialized]);

  const globalStats = useMemo((): GlobalTaskStats[] => {
    if (!isInitialized) return [];

    return tasks.map((task) => {
      const assignments = userTasks.filter((ut) => ut.taskId === task.id);
      const completedCount = assignments.filter(
        (ut) => ut.status === "COMPLETED",
      ).length;
      return {
        taskId: task.id,
        designation: task.designation,
        totalAssigned: assignments.length,
        completedCount,
        progressPercentage:
          assignments.length > 0
            ? (completedCount / assignments.length) * 100
            : 0,
      };
    });
  }, [tasks, userTasks, isInitialized]);

  // Manager Actions
  const addUser = useCallback(
    async (username: string, password: string) => {
      if (!token) return;
      try {
        setError(null);
        await usersAPI.create(username, password, token);
        await loadData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create user");
      }
    },
    [token, loadData],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      if (!token) return;
      try {
        setError(null);
        await usersAPI.delete(userId, token);
        await loadData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
      }
    },
    [token, loadData],
  );

  const createTask = useCallback(
    async (designation: string) => {
      if (!token) return;
      try {
        setError(null);
        await tasksAPI.create(designation, token);
        await loadData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create task");
      }
    },
    [token, loadData],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!token) return;
      try {
        setError(null);
        await tasksAPI.delete(taskId, token);
        await loadData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete task");
      }
    },
    [token, loadData],
  );

  const assignTask = useCallback(
    async (taskId: string, userId: string) => {
      if (!token) return;
      try {
        setError(null);
        await userTasksAPI.assign(userId, taskId, token);
        await loadData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to assign task");
      }
    },
    [token, loadData],
  );

  const updateTaskProgress = useCallback(
    async (
      assignmentId: string,
      updates: Partial<
        Pick<UserTask, "startDate" | "endDate" | "status" | "notes">
      >,
    ) => {
      if (!token) return;
      try {
        setError(null);

        // Auto-set dates based on status
        let startDate = updates.startDate;
        let endDate = updates.endDate;

        if (updates.status === "IN_PROGRESS" && !startDate) {
          startDate = new Date().toISOString().split("T")[0];
        }
        if (updates.status === "COMPLETED" && !endDate) {
          endDate = new Date().toISOString().split("T")[0];
        }
        if (updates.status === "NOT_STARTED") {
          startDate = undefined;
          endDate = undefined;
        }

        await userTasksAPI.update(
          assignmentId,
          updates.status,
          startDate,
          endDate,
          updates.notes,
          token,
        );
        await loadData(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    [token, loadData],
  );

  return {
    users,
    tasks,
    userTasks,
    currentUser,
    userTasksWithDetails,
    globalStats,
    isInitialized,
    isLoading,
    error,
    login,
    logout,
    addUser,
    deleteUser,
    createTask,
    deleteTask,
    assignTask,
    updateTaskProgress,
  };
}
