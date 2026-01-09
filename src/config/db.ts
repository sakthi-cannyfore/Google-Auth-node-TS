import mongoose from "mongoose";

export async function Database() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Mongo DB connected successfully 🍏");
  } catch (error) {
    console.log("Failed to connetc the Database 🛑💀", error);
    process.exit(1);
  }
}
