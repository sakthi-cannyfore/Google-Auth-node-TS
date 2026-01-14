import { Router, Request, Response } from "express";
import { RequireAuth } from "../middlewares/requireAuth";
import requireRole from "../middlewares/requireRole";
import { User } from "../models/user.mode";

const router = Router();

router.get(
  "/users",
  RequireAuth,
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    try {
      const users = await User.find(
        {},
        {
          role: 1,
          email: 1,
          isEmailveryfied: 1,
          createdAt: 1,
        }
      ).sort({ createdAt: -1 });

      const result = users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailveryfied: user.isEmailveryfied,
        createdAt: user.createdAt,
      }));

      return res.json({ users: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
