import express, { Response } from "express";
import { query } from "../db/pool.js";
import {
  authMiddleware,
  managerMiddleware,
  AuthRequest,
} from "../middleware/auth.js";

export const tasksRouter = express.Router();

// Get all tasks
tasksRouter.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await query(
        "SELECT id, designation, created_at FROM tasks ORDER BY created_at DESC",
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Create task (manager only)
tasksRouter.post(
  "/",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { designation } = req.body;

      if (!designation) {
        return res.status(400).json({ error: "Designation required" });
      }

      const result = await query(
        "INSERT INTO tasks (designation) VALUES ($1) RETURNING id, designation, created_at",
        [designation],
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete task (manager only)
tasksRouter.delete(
  "/:id",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const result = await query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
