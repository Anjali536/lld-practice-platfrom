import { submissionService } from "../services/submission.service.js";

export class SubmissionController {
  async createSubmission(req, res, next) {
    try {
      const { attemptId, content } = req.body;
      if (!attemptId) {
        return res.status(400).json({
          success: false,
          message: "attemptId is required in request body"
        });
      }
      const submission = await submissionService.createSubmission(attemptId, content);
      res.status(201).json({
        success: true,
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionByAttemptId(req, res, next) {
    try {
      const { attemptId } = req.params;
      const submission = await submissionService.getSubmissionByAttemptId(attemptId);
      res.status(200).json({
        success: true,
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionById(req, res, next) {
    try {
      const { id } = req.params;
      const submission = await submissionService.getSubmissionById(id);
      res.status(200).json({
        success: true,
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }
}

export const submissionController = new SubmissionController();
