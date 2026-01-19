import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.mode";
import { verifyAccessToken } from "../lib/token";

export async function RequireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message:
          "Authorization header missing or Your not user cannot access the pege",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const payload = await verifyAccessToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found and you cant access the page " });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(400).json({
        message: "Token is Invalid ",
      });
    }

    const authReq = req as any;

    authReq.user = {
      id: user.id,
      name: user.email,
      role: user.role,
      email: user.email,
      isEmailVerfied: user.isEmailveryfied,
    };

    next();
  } catch (error) {
    console.log("");
    return res.status(401).json({ message: "Unauthorized" });
  }
}
