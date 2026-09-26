import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verifies the Bearer token and attaches { _id, organization, isAdmin } from the database to req.user
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(_id).select("_id organization isAdmin");
    if (!user) {
      return res.status(401).json({ error: "Request is not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

// Use after requireAuth
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export default requireAuth;
