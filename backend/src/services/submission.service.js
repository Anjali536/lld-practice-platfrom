import { submissionRepository } from "../repositories/submission.repository.js";
import { attemptRepository } from "../repositories/attempt.repository.js";
import { evaluationService } from "./evaluation.service.js";

export class SubmissionService {
  constructor(
    subRepo = submissionRepository,
    attRepo = attemptRepository,
    evalService = evaluationService
  ) {
    this.submissionRepository = subRepo;
    this.attemptRepository = attRepo;
    this.evaluationService = evalService;
  }

  async createSubmission(attemptId, content) {
    // 1. Validate attempt exists
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      const error = new Error(`Cannot submit: Attempt "${attemptId}" was not found.`);
      error.statusCode = 404;
      throw error;
    }

    // 2. Validate attempt is in IN_PROGRESS state
    if (attempt.status !== "IN_PROGRESS") {
      const error = new Error(
        `Attempt is not in IN_PROGRESS state. Current status: "${attempt.status}".`
      );
      error.statusCode = 400;
      throw error;
    }

    // 3. Prevent duplicate submission
    const existingSubmission = await this.submissionRepository.findByAttemptId(attemptId);
    if (existingSubmission) {
      const error = new Error(`A submission already exists for attempt "${attemptId}". Duplicate submission rejected.`);
      error.statusCode = 409;
      throw error;
    }

    // 4. Validate solution content (must not be completely empty)
    const formattedContent = content || {};
    const totalContentLength = Object.values(formattedContent)
      .filter((v) => typeof v === "string")
      .reduce((acc, v) => acc + v.trim().length, 0);

    if (totalContentLength === 0) {
      const error = new Error("Submission content cannot be empty. Please provide architectural details.");
      error.statusCode = 400;
      throw error;
    }

    // 5. Save submission
    const submissionData = {
      attemptId: attempt._id,
      type: "TEXT",
      content: {
        assumptions: formattedContent.assumptions || "",
        coreClasses: formattedContent.coreClasses || "",
        responsibilities: formattedContent.responsibilities || "",
        relationships: formattedContent.relationships || "",
        designPatterns: formattedContent.designPatterns || "",
        edgeCases: formattedContent.edgeCases || "",
        explanation: formattedContent.explanation || ""
      },
      submittedAt: new Date()
    };

    const submission = await this.submissionRepository.create(submissionData);

    // 6. Update attempt status to SUBMITTED and record submittedAt timestamp
    await this.attemptRepository.update(attempt._id, {
      status: "SUBMITTED",
      submittedAt: new Date()
    });

    // 7. Trigger evaluation asynchronously via EvaluationService
    // We await evaluation so the client immediately receives evaluation confirmation or can poll
    try {
      await this.evaluationService.evaluateSubmission(submission._id);
    } catch (evalError) {
      console.warn("Evaluation failed during submission processing:", evalError.message);
    }

    return submission;
  }

  async getSubmissionById(id) {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      const error = new Error(`Submission with ID "${id}" was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return submission;
  }

  async getSubmissionByAttemptId(attemptId) {
    const submission = await this.submissionRepository.findByAttemptId(attemptId);
    if (!submission) {
      const error = new Error(`Submission for attempt "${attemptId}" was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return submission;
  }
}

export const submissionService = new SubmissionService();
