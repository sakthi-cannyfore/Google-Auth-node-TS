import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/user.mode";
import crypto from "crypto";
import { HashedPassword } from "../../lib/hash";
import { CreateAccessToken, CreateRefreshToken } from "../../lib/token";

function googleClinetKeys() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret) {
    throw new Error("Google client id or client secret id is missing ");
  }

  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
}

export async function GoogleAuthStartHandler(_req: Request, res: Response) {
  try {
    const client = googleClinetKeys();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return res.redirect(url);
  } catch (error) {
    console.log("google Auth Error ", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function GoogleCallbackHandler(req: Request, res: Response) {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).json({
      message: "Google code is missing in call back Please try again ",
    });
  }

  try {
    const client = googleClinetKeys();

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        message: "Token Id is missing ",
      });
    }

    const verifyToken = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = verifyToken.getPayload();

    const email = payload?.email;
    const name = payload?.name;
    const verified_Email = payload?.email_verified;

    if (!email || !verified_Email) {
      return res.status(400).json({
        message: "Google Email account is not verfied ",
      });
    }

    const normalized = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalized });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const passwordhash = await HashedPassword(randomPassword);

      user = await User.create({
        name: name,
        email: normalized,
        password: passwordhash,
        role: "user",
        isEmailveryfied: true,
        twoFactorEnabled: false,
      });
    } else {
      if (!user.isEmailveryfied) {
        user.isEmailveryfied = true;

        await user.save();
      }
    }

    const accessToken = CreateAccessToken(
      user.id,
      user.role as "user" | "admin",
      user.tokenVersion
    );

    const refreshToken = CreateRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Google Login Successfully ",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailveryfied,
      },
    });

  } catch (error) {
    console.log("GoogleCallback Handler Error ", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
