import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/auth", authRouter);

export default app;
