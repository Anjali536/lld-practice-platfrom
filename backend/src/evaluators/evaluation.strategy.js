/**
 * Abstract Strategy for evaluating LLD learner submissions.
 * Pluggable architecture allowing future AI/LLM or hybrid evaluators.
 */
export class EvaluationStrategy {
  async evaluate(submission, problem) {
    throw new Error("evaluate() must be implemented by subclass");
  }
}

export default EvaluationStrategy;
