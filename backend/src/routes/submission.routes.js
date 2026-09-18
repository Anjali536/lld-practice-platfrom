import { Router } from "express";
import { submissionController } from "../controllers/submission.controller.js";

const router = Router();

router.post("/", (req, res, next) => submissionController.createSubmission(req, res, next));
router.get("/:attemptId", (req, res, next) => submissionController.getSubmissionByAttemptId(req, res, next));

export default router;
