import express from "express";
import { createTask, deleteTask, updateTask, getOne, findTasksByUser, findTasksByOrg } from "../controller/taskController.js";
import requireAuth, { requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);
router.get("/user/:user", findTasksByUser);
router.get("/organization/:organization", requireAdmin, findTasksByOrg);
router.get("/:id", getOne);
router.post("/", requireAdmin, createTask);
router.delete("/:id", requireAdmin, deleteTask);
router.patch("/:id", updateTask);
router.put("/:id", updateTask);

export default router;
