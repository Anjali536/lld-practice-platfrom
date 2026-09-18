import { evaluationRepository } from "../repositories/evaluation.repository.js";
import { submissionRepository } from "../repositories/submission.repository.js";
import { attemptRepository } from "../repositories/attempt.repository.js";
import { problemRepository } from "../repositories/problem.repository.js";
import { ruleEvaluator } from "../evaluators/rule.evaluator.js";
import { aiEvaluator, AIEvaluator } from "../evaluators/ai.evaluator.js";

/**
 * Strategy Selector Factory
 * Selects evaluation strategy based on EVALUATION_MODE environment variable ('rule' | 'ai').
 */
export function selectEvaluationStrategy(mode = process.env.EVALUATION_MODE) {
  if (mode === "ai") {
    return aiEvaluator;
  }
  return ruleEvaluator;
}

export class EvaluationService {
  constructor(
    evalRepo = evaluationRepository,
    subRepo = submissionRepository,
    attRepo = attemptRepository,
    probRepo = problemRepository,
    strategy = null
  ) {
    this.evaluationRepository = evalRepo;
    this.submissionRepository = subRepo;
    this.attemptRepository = attRepo;
    this.problemRepository = probRepo;
    this.explicitStrategy = strategy;
  }

  /**
   * Returns the active evaluation strategy (injected or selected from environment)
   */
  getStrategy() {
    return this.explicitStrategy || selectEvaluationStrategy();
  }

  async evaluateSubmission(submissionId) {
    // 1. Fetch submission
    const submission = await this.submissionRepository.findById(submissionId);
    if (!submission) {
      const error = new Error(`Cannot evaluate: Submission "${submissionId}" not found.`);
      error.statusCode = 404;
      throw error;
    }

    // 2. Fetch associated attempt and problem
    const attempt = await this.attemptRepository.findById(
      submission.attemptId._id || submission.attemptId
    );
    if (!attempt) {
      const error = new Error("Associated attempt for submission not found.");
      error.statusCode = 404;
      throw error;
    }

    const problem = await this.problemRepository.findById(
      attempt.problemId?._id || attempt.problemId
    );

    const activeStrategy = this.getStrategy();
    const evaluatorType = activeStrategy instanceof AIEvaluator ? "AI" : "RULE";

    // 3. Create or initialize evaluation record in EVALUATING status
    let evaluation = await this.evaluationRepository.findBySubmissionId(submissionId);
    if (!evaluation) {
      evaluation = await this.evaluationRepository.create({
        submissionId: submission._id,
        status: "EVALUATING",
        evaluatorType
      });
    } else {
      evaluation = await this.evaluationRepository.update(evaluation._id, {
        status: "EVALUATING",
        evaluatorType
      });
    }

    // Update attempt status to EVALUATING
    await this.attemptRepository.updateStatus(attempt._id, "EVALUATING");

    try {
      // 4. Run strategy (RuleEvaluator or AIEvaluator)
      const result = await activeStrategy.evaluate(submission, problem);

      // 5. Update evaluation to COMPLETED
      const updatedEvaluation = await this.evaluationRepository.update(evaluation._id, {
        status: "COMPLETED",
        evaluatorType: result.evaluatorType || evaluatorType,
        model: result.model || null,
        criteria: result.criteria,
        overallSummary: result.overallSummary,
        strengths: result.strengths,
        improvements: result.improvements,
        evaluatedAt: new Date()
      });

      // 6. Update attempt status to COMPLETED
      await this.attemptRepository.updateStatus(attempt._id, "COMPLETED");

      return updatedEvaluation;
    } catch (evalError) {
      console.error(
        `[EvaluationService] ${evaluatorType} evaluation failed for submission ${submissionId}:`,
        evalError.message
      );

      // Important: When AI evaluation fails, persist FAILED state (do not fallback silently)
      await this.evaluationRepository.update(evaluation._id, {
        status: "FAILED",
        evaluatorType,
        model: activeStrategy.llmClient?.model || null
      });

      await this.attemptRepository.updateStatus(attempt._id, "FAILED");

      throw evalError;
    }
  }

  async getEvaluationBySubmissionId(submissionId) {
    const evaluation = await this.evaluationRepository.findBySubmissionId(submissionId);
    if (!evaluation) {
      const error = new Error(`Evaluation for submission "${submissionId}" was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return evaluation;
  }

  async getEvaluationById(id) {
    const evaluation = await this.evaluationRepository.findById(id);
    if (!evaluation) {
      const error = new Error(`Evaluation with ID "${id}" was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return evaluation;
  }
}

export const evaluationService = new EvaluationService();
