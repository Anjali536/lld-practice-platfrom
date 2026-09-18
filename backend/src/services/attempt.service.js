import { attemptRepository } from "../repositories/attempt.repository.js";
import { problemRepository } from "../repositories/problem.repository.js";

export class AttemptService {
  constructor(attemptRepo = attemptRepository, problemRepo = problemRepository) {
    this.attemptRepository = attemptRepo;
    this.problemRepository = problemRepo;
  }

  async createAttempt(problemId) {
    // 1. Validate problem exists
    const problem = await this.problemRepository.findById(problemId);
    if (!problem) {
      const error = new Error(`Cannot create attempt: Problem "${problemId}" does not exist.`);
      error.statusCode = 404;
      throw error;
    }

    // 2. Calculate attempt number
    const count = await this.attemptRepository.countByProblemId(problemId);
    const attemptNumber = count + 1;

    // 3. Create attempt
    const attemptData = {
      problemId: problem._id,
      attemptNumber,
      status: "IN_PROGRESS",
      startedAt: new Date(),
      draft: {
        assumptions: "",
        coreClasses: "",
        responsibilities: "",
        relationships: "",
        designPatterns: "",
        edgeCases: "",
        explanation: ""
      }
    };

    return this.attemptRepository.create(attemptData);
  }

  async getAttemptById(id) {
    const attempt = await this.attemptRepository.findById(id);
    if (!attempt) {
      const error = new Error(`Attempt with ID "${id}" was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return attempt;
  }

  async getAllAttempts() {
    return this.attemptRepository.findAll();
  }

  async getAttemptsByProblemId(problemId) {
    return this.attemptRepository.findByProblemId(problemId);
  }

  async saveDraft(attemptId, draftData) {
    const attempt = await this.getAttemptById(attemptId);

    if (attempt.status !== "IN_PROGRESS") {
      const error = new Error(
        `Draft can only be updated when attempt is IN_PROGRESS. Current status: "${attempt.status}".`
      );
      error.statusCode = 400;
      throw error;
    }

    const updatedDraft = {
      ...(attempt.draft ? attempt.draft.toObject?.() || attempt.draft : {}),
      ...draftData
    };

    return this.attemptRepository.update(attemptId, { draft: updatedDraft });
  }

  async updateAttemptStatus(id, status) {
    const validStatuses = ["IN_PROGRESS", "SUBMITTED", "EVALUATING", "COMPLETED", "FAILED"];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid attempt status "${status}".`);
      error.statusCode = 400;
      throw error;
    }
    return this.attemptRepository.updateStatus(id, status);
  }
}

export const attemptService = new AttemptService();
