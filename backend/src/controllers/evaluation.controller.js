import { evaluationService } from "../services/evaluation.service.js";

export class EvaluationController {
  async getEvaluationBySubmissionId(req, res, next) {
    try {
      const { submissionId } = req.params;
      const evaluation = await evaluationService.getEvaluationBySubmissionId(submissionId);
      res.status(200).json({
        success: true,
        data: evaluation
      });
    } catch (error) {
      next(error);
    }
  }

  async getEvaluationById(req, res, next) {
    try {
      const { id } = req.params;
      const evaluation = await evaluationService.getEvaluationById(id);
      res.status(200).json({
        success: true,
        data: evaluation
      });
    } catch (error) {
      next(error);
    }
  }
}

export const evaluationController = new EvaluationController();
