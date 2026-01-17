import express, { Response } from "express";
import { query } from "../db/pool.js";
import {
  authMiddleware,
  managerMiddleware,
  AuthRequest,
} from "../middleware/auth.js";

export const userTasksRouter = express.Router();

// Get user's tasks
userTasksRouter.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.query.userId || req.userId;

      const result = await query(
        `SELECT ut.id, ut.user_id, ut.task_id, ut.start_date, ut.end_date, ut.status, ut.notes, ut.updated_at,
              t.designation as task_designation, u.username
       FROM user_tasks ut
       JOIN tasks t ON ut.task_id = t.id
       JOIN users u ON ut.user_id = u.id
       WHERE ut.user_id = $1
       ORDER BY ut.updated_at DESC`,
        [userId],
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Get user tasks error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get all user tasks with details (manager only)
userTasksRouter.get(
  "/admin/all",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await query(
        `SELECT ut.id, ut.user_id, ut.task_id, ut.start_date, ut.end_date, ut.status, ut.notes, ut.updated_at,
              t.designation as task_designation, u.username
       FROM user_tasks ut
       JOIN tasks t ON ut.task_id = t.id
       JOIN users u ON ut.user_id = u.id
       ORDER BY ut.updated_at DESC`,
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Get all user tasks error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Assign task to user (manager only)
userTasksRouter.post(
  "/",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId, taskId } = req.body;

      if (!userId || !taskId) {
        return res.status(400).json({ error: "userId and taskId required" });
      }

      const result = await query(
        `INSERT INTO user_tasks (user_id, task_id, status) VALUES ($1, $2, $3)
       RETURNING id, user_id, task_id, status, updated_at`,
        [userId, taskId, "NOT_STARTED"],
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ error: "Task already assigned to this user" });
      }
      console.error("Assign task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update task progress
userTasksRouter.put(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, startDate, endDate, notes } = req.body;

      // Check if user owns this task or is manager
      const userTaskResult = await query(
        "SELECT user_id FROM user_tasks WHERE id = $1",
        [id],
      );
      const userTask = userTaskResult.rows[0];

      if (!userTask) {
        return res.status(404).json({ error: "User task not found" });
      }

      if (userTask.user_id !== req.userId && req.user?.role !== "MANAGER") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const result = await query(
        `UPDATE user_tasks
       SET status = COALESCE($1, status),
           start_date = COALESCE($2, start_date),
           end_date = COALESCE($3, end_date),
           notes = COALESCE($4, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, user_id, task_id, status, start_date, end_date, notes, updated_at`,
        [status || null, startDate || null, endDate || null, notes || null, id],
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Remove task from user (manager only)
userTasksRouter.delete(
  "/:id",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const result = await query(
        "DELETE FROM user_tasks WHERE id = $1 RETURNING id",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User task not found" });
      }

      res.json({ message: "Task removed from user" });
    } catch (error) {
      console.error("Delete user task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
