import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import whoisRoutes from "./routes/whois.js";
import contentAnalysisRoute from "./routes/contentAnalysisRoute.js";
import ipRoutes from "./routes/ipRoutes.js";
import checkBlockedIp from "./middleware/ipBlockMiddleware.js";
import violationRoutes from "./routes/violationRoutes.js";
import speedRoutes from "./routes/speedRoute.js";
import adRoutes from "./routes/adRoutes.js";
import aiInsightsRoutes from "./routes/aiInsightsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use(checkBlockedIp);

const allowedOrigins = [
  "http://localhost:5173",
  "https://crawler-integration.netlify.app",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/whois", whoisRoutes);
app.use("/api", contentAnalysisRoute);
app.use("/api", ipRoutes);
app.use("/api", violationRoutes);
app.use("/api/speed", speedRoutes);
app.use("/api/ads", adRoutes);
app.use("/api", aiInsightsRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});