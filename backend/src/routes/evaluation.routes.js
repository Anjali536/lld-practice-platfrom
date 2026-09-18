import { Router } from "express";
import { evaluationController } from "../controllers/evaluation.controller.js";

const router = Router();

router.get("/:submissionId", (req, res, next) => evaluationController.getEvaluationBySubmissionId(req, res, next));

export default router;
