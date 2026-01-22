import { Request, Response } from "express";
import { User } from "../../models/user.mode";
import { authenticator } from "otplib";
export async function twoFactorAuthentication(req: Request, res: Response) {
  authenticator.options = {
    window: 1, // allow previous & next 30s window
  };
  const reqAuth = req as any;

  const userAuth = reqAuth.user;

  if (!userAuth) {
    return res.status(400).json({
      message: "User is not Authenticated ",
    });
  }

  try {
    const user = await User.findById(userAuth.id);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const secret = authenticator.generateSecret();

    const issuer = "NodeWithTSGoogleAuthentication";

    if (user.twoFactorSecret && user.twoFactorEnabled === false) {
      const otpUrl = authenticator.keyuri(
        user.email,
        "NodeWithTSGoogleAuthentication",
        user.twoFactorSecret
      );

      return res.status(200).json({
        message: "2FA already initialized",
        otpUrl,
      });
    }
    const otpUrl = authenticator.keyuri(user.email, issuer, secret);

    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;

    await user.save();

    return res.status(201).json({
      message: "TwoFactor Auth Setup is Done",
      otpUrl,
      secret,
    });
  } catch (error) {
    console.log("2F Authenticated Error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function VerifyTwoFactorAuth(req: Request, res: Response) {
  const reqAuth = req as any;

  const userAuth = reqAuth.user;

  if (!userAuth) {
    return res.status(400).json({
      message: "User is not Authenticated ",
    });
  }

  try {
    // const { code } = req.body as { code?: string };
    const code = (req.body.code as string)?.trim();

    if (!code) {
      return res.status(400).json({
        message: "Code is Required ",
      });
    }

    const user = await User.findById(userAuth.id);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        message: "You dont have secret 2F Athentication  ",
      });
    }

    console.log("#########################################", {
      code,
      secret: user.twoFactorSecret,
      now: new Date(),
    });

    const isValid = authenticator.check(code, user.twoFactorSecret);

    if (!isValid) {
      return res.status(400).json({
        message: "Please enter the Valid code ",
      });
    }

    user.twoFactorEnabled = true;

    await user.save();
    return res.status(200).json({
      message: "2F Authentication Enabled",
      twoFactorEnabled: true,
    });
  } catch (error) {
    console.log("2F VerifyTwoFactorAuth Error ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
