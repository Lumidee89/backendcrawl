const express = require("express");
const cors = require("cors"); // Import CORS
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const whoisRoutes = require("./routes/whois");
const contentAnalysisRoute = require('./routes/contentAnalysisRoute');
const ipRoutes = require('./routes/ipRoutes');
const violationRoutes = require('./routes/violationRoutes');
const speedRoutes = require('./routes/speedRoute');
const adRoutes = require('./routes/adRoutes');
const aiInsightsRoutes = require('./routes/aiInsightsRoutes');

require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Allowed CORS Origin
const allowedOrigins = [
  "http://localhost:5173",
  "https://crawler-integration.netlify.app",
  "https://crawlertest.netlify.app",
];

// CORS Middleware
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/whois", whoisRoutes);
app.use("/api", contentAnalysisRoute);
app.use("/api", ipRoutes);
app.use("/api", violationRoutes);
app.use('/api/speed', speedRoutes);
app.use('/api/ads', adRoutes);
app.use('/api', aiInsightsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const whoisRoutes = require('./routes/whois');
// require('dotenv').config();

// const app = express();


// connectDB();


// app.use(express.json());


// app.use('/api/auth', authRoutes);
// app.use('/api/whois', whoisRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });