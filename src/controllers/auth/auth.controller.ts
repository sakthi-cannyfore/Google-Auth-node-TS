import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import z from "zod";
import { User } from "../../models/user.mode";
import { checkPassword, HashedPassword } from "../../lib/hash";
import jwt from "jsonwebtoken";
import { sendMailer } from "../../lib/email";
import { CreateAccessToken, RefreshToken } from "../../lib/token";

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
  const token = req.query.token as string | undefined;

  if (!token) {
    return res.status(400).json({
      message: " Verification Token is Missing ",
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      sub: string;
    };

    const user = await User.findById(verifyToken.sub);

    if (!user) {
      return res.status(400).json({
        message: "User not found !",
      });
    }

    if (user.isEmailveryfied) {
      return (
        (user.isEmailveryfied = true),
        res.status(200).json({
          message: "Email is already verified ",
        })
      );
    }
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
    if (!result.success) {
      return res.status(400).json({
        message: `Invalid Data`,
        error: z.treeifyError(result.error),
      });
    }

    const { email, password } = result.data;
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

    const accessToken = await CreateAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const createdRefreshToken = RefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshtoken", createdRefreshToken, {
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
