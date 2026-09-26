// Package depencies
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import orgRoutes from "./routes/org.js";
import taskRoutes from "./routes/task.js";
import userRoutes from "./routes/user.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Server setup
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Once a browser has seen the site over HTTPS, make it always use HTTPS (ignored over plain http, e.g. localhost)
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  next();
});

// Collapse duplicate slashes (client builds some URLs like "/tasks//organization/x")
app.use((req, res, next) => {
  req.url = req.url.replace(/\/{2,}/g, "/");
  next();
});

// API routes
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/organizations", orgRoutes);

// Unknown API paths get a JSON 404 instead of the React page
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

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
