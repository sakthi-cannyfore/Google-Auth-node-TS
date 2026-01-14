import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";
import adminRouter from "./routes/admin.router";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

export default app;
