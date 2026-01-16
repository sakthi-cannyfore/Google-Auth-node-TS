import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import z from "zod";
import { User } from "../../models/user.mode";
import { checkPassword, HashedPassword } from "../../lib/hash";
import jwt from "jsonwebtoken";
import { sendMailer } from "../../lib/email";
import {
  CreateAccessToken,
  CreateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../lib/token";
import crypto from "crypto";
import { authenticator } from "otplib";

function getAppUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

export async function registerHandler(req: Request, res: Response) {
  try {
    const result = await registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: `Invalid Data`,
        error: z.treeifyError(result.error),
      });
    }

    const { name, email, password } = result.data;

    const nomalizedEmail = email.toLowerCase().trim();

    const checkUser = await User.findOne({ email: nomalizedEmail });

    if (checkUser) {
      return res.status(409).json({
        message:
          "Please the user Already Exist Please try with a different Email ",
      });
    }

    const hashepassword = await HashedPassword(password);

    const createNewUser = await User.create({
      email: nomalizedEmail,
      password: hashepassword,
      role: "user",
      isEmailveryfied: false,
      twoFactorEnabled: false,
      name,
    });

    const verifyToken = jwt.sign(
      {
        sub: createNewUser.id,
      },
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    const verifyUrl = `${getAppUrl()}/auth/verify-email?token=${verifyToken}`;

    await sendMailer(
      createNewUser.email,
      "Verify your email",

      `
        <p> <> Please verify your email by clicking this link</></p>
        <p><a href=${verifyUrl}>${verifyUrl}</a></p>
        `
    );
    return res.status(201).json({
      message: "User Registerd Successfully",
      user: {
        id: createNewUser.id,
        email: createNewUser.email,
        role: createNewUser.role,
        isEmailveryfied: createNewUser.isEmailveryfied,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      messagae: "Internal server error",
    });
  }
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({
      message: " Verification Token is Missing ",
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      sub: string;
    };

    console.log("verifyToken", verifyToken);

    const user = await User.findById(verifyToken.sub);

    if (!user) {
      return res.status(400).json({
        message: "User not found !",
      });
    }

    if (user.isEmailveryfied) {
      return res.status(200).json({
        message: "Email is already verified ",
      });
    }

    user.isEmailveryfied = true;
    await user.save();
    return res.status(200).json({
      message: "Email is now verified you can login  ",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      messagae: "Internal server error",
    });
  }
}

export async function loginHandler(req: Request, res: Response) {
  const result = await loginSchema.safeParse(req.body);

  try {
    console.log("login credentials ", req.headers["authorization"]);
    if (!result.success) {
      return res.status(400).json({
        message: `Invalid Data`,
        error: z.treeifyError(result.error),
      });
    }

    const { email, password, twoFactorCode } = result.data;
    const nomalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: nomalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password ",
      });
    }

    const ok = await checkPassword(password, user.password);

    if (!ok) {
      return res.status(404).json({
        message: "Please Enter the valid password",
      });
    }

    if (!user.isEmailveryfied) {
      return res.status(403).json({
        message: "Please verify your Email check the mail",
      });
    }

    // if (user.twoFactorEnabled) {
    //   if (!twoFactorCode || typeof twoFactorCode !== "string") {
    //     return res.status(400).json({
    //       message: "Two Factor code is Required ",
    //     });
    //   }

    //   if (!user.twoFactorSecret) {
    //     return res.status(400).json({
    //       message: "Two factor misconfigured for this account ",
    //     });
    //   }

    //   // important note if user enabled the 2fauth should verify the code

    //   const verify2fa = authenticator.check(
    //     twoFactorCode,
    //     user.twoFactorSecret
    //   );

    //   if (!verify2fa) {
    //     return res.status(400).json({
    //       message: "Invalid Two Factor code ",
    //     });
    //   }
    // }

    console.log("### USER ###", user);

    if (user.twoFactorEnabled) {
      if (!twoFactorCode || typeof twoFactorCode !== "string") {
        return res.status(400).json({
          message: "Two Factor code is required",
        });
      }

      if (!user.twoFactorSecret) {
        return res.status(400).json({
          message: "Two-factor authentication is misconfigured",
        });
      }

      const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret);

      if (!isValid) {
        return res.status(400).json({
          message: "Invalid Two Factor code",
        });
      }
    }

    const accessToken = await CreateAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const refreshToken = CreateRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    const cookieID = res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successfully ",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailveryfied: user.isEmailveryfied,
        istwoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      messagae: "Internal server error",
    });
  }
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const token = req.cookies?.refresh_token as string | undefined;

    console.log("token", token);

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        message: "Refresh token is missing",
      });
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(404).json({
        message: "User not Found ",
      });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(404).json({
        message: "Refresh Token is Invalid  ",
      });
    }
    const newAccessToken = CreateAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );
    const refreshToken = CreateRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    const firstToken = res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("firstToken", firstToken);

    return res.status(200).json({
      message: "Token Refreshed  ",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailveryfied: user.isEmailveryfied,
        istwoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function Logout(_req: Request, res: Response) {
  res.clearCookie("refresh_token", { path: "/" });
  return res.status(200).json({
    message: "Log Out ",
  });
}

export async function forgetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(400).json({
        messgae: "Email is Required",
      });
    }

    const nomalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: nomalizedEmail });

    if (!user) {
      return res.status(200).json({
        messgae: "If Email is valid ,You get the verification link ",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const TokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = TokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const result = `${getAppUrl()}/auth/forget-password?token=${rawToken}`;

    await sendMailer(
      user.email,
      "Forget Password",
      `<p>Click the Link Below for the reset Password  </p>
        <p><a href=${result}>${result}<a/></p>
      `
    );

    return res.status(200).json({
      message: "If the email is valid, you will receive the reset link",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function ResetPasswordHandler(req: Request, res: Response) {
  try {
    const { token, password } = req.body as {
      token?: string;
      password: string;
    };

    if (!token) {
      return res
        .status(400)
        .json({ message: "Reset password Token is Missing !" });
    }

    if (password.length <= 5) {
      return res.status(200).json({
        message: "Password length is greater then 5 char",
      });
    }

    const TokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: TokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid user or Token Expires",
      });
    }

    const newPassword = await HashedPassword(password);

    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.tokenVersion = +1;

    await user.save();

    res.json({
      message: "Password Reset Successfully ",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
