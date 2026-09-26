import express from "express";
const router = express.Router();

import { orgSignup, findOrgName } from "../controller/orgController.js";
import requireAuth from "../middleware/requireAuth.js";

router.post("/signup", orgSignup);

router.get("/:organization", requireAuth, findOrgName)

export default router;
