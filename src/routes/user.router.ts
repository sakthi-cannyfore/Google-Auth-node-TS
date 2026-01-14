import express, { Request, Response } from "express";
import { RequireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/me", RequireAuth, (req: Request, res: Response) => {
  const reAuth = req as any;

  const authUser = reAuth.user;

  res.status(200).json({
    user: authUser,
  });
});

export default router;
