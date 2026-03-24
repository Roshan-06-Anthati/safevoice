import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config({ path: "./.env" });

console.log("ENV CHECK - PORT:", process.env.PORT);
console.log("ENV CHECK - OPENAI:", process.env.OPENAI_API_KEY ? "Loaded succesfully" : "Missing");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/complaints", complaintRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
