const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const whoisRoutes = require("./routes/whois");
const contentAnalysisRoute = require("./routes/contentAnalysisRoute");
const ipRoutes = require("./routes/ipRoutes");
const checkBlockedIp = require("./middleware/ipBlockMiddleware");
const violationRoutes = require("./routes/violationRoutes");
const speedRoutes = require("./routes/speedRoute");
const adRoutes = require("./routes/adRoutes");
const aiInsightsRoutes = require("./routes/aiInsightsRoutes");
const profileRoutes = require("./routes/profileRoutes");

require("dotenv").config();

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