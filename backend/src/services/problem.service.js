import { problemRepository } from "../repositories/problem.repository.js";

export class ProblemService {
  constructor(repo = problemRepository) {
    this.problemRepository = repo;
  }

  async getAllProblems() {
    return this.problemRepository.findAll();
  }

  async getProblemById(id) {
    const problem = await this.problemRepository.findById(id);
    if (!problem) {
      const error = new Error(`Problem with ID "${id}" was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return problem;
  }
}

export const problemService = new ProblemService();
