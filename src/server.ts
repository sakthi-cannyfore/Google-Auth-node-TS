import dotenv from "dotenv";
import { Database } from "./config/db";
import app from "./app";
import http from "http";

dotenv.config();

async function StartServer() {
  try {
    await Database();
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
      console.log(`Sever is Running ${process.env.PORT} 🍏`);
    });
  } catch (error) {
    console.log("Failed start server", error);
  }
}

StartServer().catch((err) => {
  console.log("Error While starting the server", err);
  process.exit(1);
});
