import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import jwt from "jsonwebtoken";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import backupRoutes from "./routes/backup.route.js";

dotenv.config();

const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:5001/oauth/google/callback";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!app) {
  global.app = express();
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/backup", backupRoutes);

app.get("/oauth/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token, id_token } = response.data;

    const userInfo = jwt.decode(id_token);
    if (!userInfo || !userInfo.email) {
      return res.status(400).json({ error: "Invalid ID token received" });
    }

    const { email, sub } = userInfo;

    console.log("✅ Google User:", userInfo);

    const jwtToken = jwt.sign({ email, googleId: sub }, JWT_SECRET, { expiresIn: "7d" });

    console.log("🔑 JWT Token:", jwtToken);

    res.json({ jwtToken, refresh_token });

  } catch (error) {
    console.error("❌ Error exchanging code:", error.response?.data || error);
    res.status(500).json({ error: "Failed to get tokens" });
  }
});

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

app.get("/protected", verifyJWT, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log("✅ Server is running on PORT:", PORT);
  });
};

startServer();
