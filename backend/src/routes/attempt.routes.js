import { Router } from "express";
import { attemptController } from "../controllers/attempt.controller.js";

const router = Router();

router.post("/", (req, res, next) => attemptController.createAttempt(req, res, next));
router.get("/", (req, res, next) => attemptController.getAllAttempts(req, res, next));
router.get("/:id", (req, res, next) => attemptController.getAttemptById(req, res, next));
router.patch("/:id/draft", (req, res, next) => attemptController.saveDraft(req, res, next));

export default router;
