import { NextFunction, Request, Response } from "express";

function requireRole(role: "user" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
    const reAuth = req as any;
    const userAuth = reAuth.user;

    if (!userAuth) {
      return res
        .status(401)
        .json({ message: "User not found and you cant access the page " });
    }

    if (userAuth.role !== role) {
      return res.status(403).json({
        message: "Only Admin can access this page !",
      });
    }
    return next();
  };
}

export default requireRole;
