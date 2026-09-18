import { attemptService } from "../services/attempt.service.js";

export class AttemptController {
  async createAttempt(req, res, next) {
    try {
      const { problemId } = req.body;
      if (!problemId) {
        return res.status(400).json({
          success: false,
          message: "problemId is required in request body"
        });
      }
      const attempt = await attemptService.createAttempt(problemId);
      res.status(201).json({
        success: true,
        data: attempt
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttemptById(req, res, next) {
    try {
      const { id } = req.params;
      const attempt = await attemptService.getAttemptById(id);
      res.status(200).json({
        success: true,
        data: attempt
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAttempts(req, res, next) {
    try {
      const { problemId } = req.query;
      const attempts = problemId
        ? await attemptService.getAttemptsByProblemId(problemId)
        : await attemptService.getAllAttempts();

      res.status(200).json({
        success: true,
        data: attempts
      });
    } catch (error) {
      next(error);
    }
  }

  async saveDraft(req, res, next) {
    try {
      const { id } = req.params;
      const draftData = req.body;
      const updatedAttempt = await attemptService.saveDraft(id, draftData);
      res.status(200).json({
        success: true,
        data: updatedAttempt
      });
    } catch (error) {
      next(error);
    }
  }
}

export const attemptController = new AttemptController();
