import express from "express";
import { signupUser, loginUser, findUsersByOrg, deleteUserById, updateUser } from "../controller/userController.js";
import requireAuth, { requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

//Login Route
router.post("/login", loginUser);
//Sign Up Route (admin adds a user to their own organization)
router.post("/signup", requireAuth, requireAdmin, signupUser);
// Find by org
router.get("/:organization", requireAuth, findUsersByOrg);
// Delete by id
router.delete("/delete/:id", requireAuth, requireAdmin, deleteUserById);
// Update user
router.put("/update", requireAuth, requireAdmin, updateUser);

export default router;
