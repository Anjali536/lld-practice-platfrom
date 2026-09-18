import { problemService } from "../services/problem.service.js";

export class ProblemController {
  async getAllProblems(req, res, next) {
    try {
      const problems = await problemService.getAllProblems();
      res.status(200).json({
        success: true,
        data: problems
      });
    } catch (error) {
      next(error);
    }
  }

  async getProblemById(req, res, next) {
    try {
      const { id } = req.params;
      const problem = await problemService.getProblemById(id);
      res.status(200).json({
        success: true,
        data: problem
      });
    } catch (error) {
      next(error);
    }
  }
}

export const problemController = new ProblemController();
