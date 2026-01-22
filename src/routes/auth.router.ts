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
import {
  getOAuthUser,
  GoogleAuthStartHandler,
  GoogleCallbackHandler,
} from "../controllers/auth/google.auth.controller";
import { RequireAuth } from "../middlewares/requireAuth";
import {
  twoFactorAuthentication,
  VerifyTwoFactorAuth,
} from "../controllers/auth/twoFactor.auth.controller";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/verify-email", verifyEmailHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", Logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", ResetPasswordHandler);

// 2fauth routes
router.post("/2fauth/setup", RequireAuth, twoFactorAuthentication);
router.post("/2fauth/verify", RequireAuth, VerifyTwoFactorAuth);

// google authentication test
router.get("/google", GoogleAuthStartHandler);
router.get("/google/callback", GoogleCallbackHandler);

// Oath 
router.get("/google/success", getOAuthUser);


export default router;
