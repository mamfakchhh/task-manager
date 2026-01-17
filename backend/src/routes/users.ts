import express, { Response } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db/pool.js";
import {
  authMiddleware,
  managerMiddleware,
  AuthRequest,
} from "../middleware/auth.js";

export const usersRouter = express.Router();

// Get all users (manager only)
usersRouter.get(
  "/",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await query(
        "SELECT id, username, role, created_at FROM users ORDER BY created_at DESC",
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Create user (manager only)
usersRouter.post(
  "/",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await query(
        "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at",
        [username, passwordHash, "USER"],
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Username already exists" });
      }
      console.error("Create user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Delete user (manager only)
usersRouter.delete(
  "/:id",
  authMiddleware,
  managerMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const result = await query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update user password
usersRouter.put(
  "/:id/password",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      // Users can only change their own password unless they're managers
      if (req.userId !== id && req.user?.role !== "MANAGER") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const userResult = await query(
        "SELECT password_hash FROM users WHERE id = $1",
        [id],
      );
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (req.user?.role !== "MANAGER") {
        const isValidPassword = await bcrypt.compare(
          oldPassword,
          user.password_hash,
        );
        if (!isValidPassword) {
          return res.status(401).json({ error: "Invalid old password" });
        }
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await query(
        "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [newPasswordHash, id],
      );

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
