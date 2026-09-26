// Package depencies
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import orgRoutes from "./routes/org.js";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/user.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Server setup
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// Collapse duplicate slashes (client builds some URLs like "/tasks//organization/x")
app.use((req, res, next) => {
  req.url = req.url.replace(/\/{2,}/g, "/");
  next();
});

// API routes
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/organizations", orgRoutes);

// Serve the built React client; unknown non-API paths fall back to index.html for client-side routing
const clientBuild = path.join(path.dirname(fileURLToPath(import.meta.url)), "../client/build");
app.use(express.static(clientBuild));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});

// DB Connect
mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //port listen
    app.listen(PORT, () => {
      console.log("Server listening at", PORT);
    });
  })
  .catch((error) => {
    console.log("ERROR....", error);
  });
