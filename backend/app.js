import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 9000;
import userRoutes from "./routes/userRoutes.js";
import userStatusRoutes from "./routes/userStatusRoutes.js";
import UserMealPlanRoutes from "./routes/UserMealPlanRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/user", userStatusRoutes);
app.use("/api/user", UserMealPlanRoutes);
app.use("/api", aiRoutes);

// Proxy endpoint for exercise images - uses free-exercise-db from GitHub
app.get("/api/proxy-image", async (req, res) => {
  try {
    const exerciseName = req.query.name;
    
    if (!exerciseName) {
      return res.status(400).json({ error: "Name parameter required" });
    }
    
    console.log("Fetching image for:", exerciseName);
    
    // Try multiple name variations
    const nameVariations = [
      exerciseName.toLowerCase().replace(/\s+/g, '-'),  // Original: "dumbbell lying supination" -> "dumbbell-lying-supination"
      exerciseName.toLowerCase().replace(/\s+/g, '_'),  // With underscores
      exerciseName.toLowerCase().split(' ')[0],  // Just first word
      exerciseName.toLowerCase().replace(/\s+/g, ''),   // No spaces
    ];
    
    for (const variation of nameVariations) {
      try {
        const githubUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${variation}.gif`;
        console.log(`Trying: ${githubUrl}`);
        
        const response = await axios.get(githubUrl, { 
          responseType: "arraybuffer",
          timeout: 8000
        });
        
        console.log(`✓ Image found for: ${exerciseName} (as ${variation})`);
        res.set("Content-Type", response.headers["content-type"] || "image/gif");
        res.set("Cache-Control", "public, max-age=86400");
        return res.send(response.data);
      } catch (error) {
        console.log(`✗ Not found as: ${variation}`);
        continue;
      }
    }
    
    console.log("⚠ Image not found for:", exerciseName);
    return res.status(404).json({ error: "Image not found" });
    
  } catch (error) {
    console.error("Image proxy error:", error.message);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "frontend/build")));
  
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
  } else {
    app.get("/", (req, res) => res.send("Server is ready"));
  }

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;