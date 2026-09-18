import { Router } from "express";
import { problemController } from "../controllers/problem.controller.js";

const router = Router();

router.get("/", (req, res, next) => problemController.getAllProblems(req, res, next));
router.get("/:id", (req, res, next) => problemController.getProblemById(req, res, next));

export default router;
