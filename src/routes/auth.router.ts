import { Router } from "express";
import {
  forgetPassword,
  loginHandler,
  Logout,
  refreshHandler,
  registerHandler,
  ResetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/auth/auth.controller";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/verify-email", verifyEmailHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", Logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", ResetPasswordHandler);

export default router;
