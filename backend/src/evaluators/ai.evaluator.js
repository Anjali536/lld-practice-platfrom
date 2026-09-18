import { EvaluationStrategy } from "./evaluation.strategy.js";
import { defaultLLMClient } from "./llm.client.js";
import {
  buildSystemPrompt,
  buildEvaluationPrompt,
  EXPECTED_CRITERIA_NAMES
} from "./evaluation.prompt.js";

/**
 * AI-powered LLD Evaluator using LLM reasoning.
 * Interrogates learner submissions against architectural criteria and produces
 * evidence-backed, explainable feedback.
 */
export class AIEvaluator extends EvaluationStrategy {
  constructor(llmClient = defaultLLMClient) {
    super();
    this.llmClient = llmClient;
  }

  async evaluate(submission, problem) {
    if (!problem) {
      throw new Error("Cannot run AI evaluation: problem specification is missing.");
    }
    if (!submission || !submission.content) {
      throw new Error("Cannot run AI evaluation: submission content is missing.");
    }

    const systemPrompt = buildSystemPrompt();
    const prompt = buildEvaluationPrompt(problem, submission);

    // 1. Invoke LLM provider
    const rawResponse = await this.llmClient.complete({
      systemPrompt,
      prompt,
      temperature: 0.2
    });

    // 2. Parse JSON response (handling potential markdown code blocks)
    let parsed;
    try {
      const sanitized = rawResponse
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "");
      parsed = JSON.parse(sanitized);
    } catch (parseErr) {
      throw new Error(
        `AI evaluation failed: LLM output could not be parsed as JSON (${parseErr.message}).`
      );
    }

    // 3. Validate structured AI response
    this.validateResponse(parsed);

    // 4. Return normalized evaluation result
    return {
      evaluatorType: "AI",
      model: this.llmClient.model || "configured-model",
      criteria: parsed.criteria.map((c) => ({
        name: c.name.trim(),
        score: Math.round(Number(c.score)),
        evidence: String(c.evidence || "").trim(),
        concern: String(c.concern || "").trim(),
        suggestion: String(c.suggestion || "").trim(),
        confidence: Number(c.confidence)
      })),
      overallSummary: String(parsed.overallSummary).trim(),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : []
    };
  }

  /**
   * Strictly validates LLM output against the rubric specification.
   */
  validateResponse(data) {
    if (!data || typeof data !== "object") {
      throw new Error("AI evaluation response must be a JSON object.");
    }

    if (!Array.isArray(data.criteria)) {
      throw new Error("AI response missing 'criteria' array.");
    }

    if (data.criteria.length !== 6) {
      throw new Error(
        `AI evaluation must return exactly 6 criteria, but received ${data.criteria.length}.`
      );
    }

    const criteriaNamesInResponse = data.criteria.map((c) => c?.name?.trim());
    for (const expected of EXPECTED_CRITERIA_NAMES) {
      if (!criteriaNamesInResponse.includes(expected)) {
        throw new Error(`AI response missing required criterion: "${expected}".`);
      }
    }

    for (const c of data.criteria) {
      const score = Number(c.score);
      if (!Number.isInteger(score) || score < 1 || score > 5) {
        throw new Error(
          `Criterion "${c.name}" has invalid score "${c.score}". Score must be an integer between 1 and 5.`
        );
      }

      const confidence = Number(c.confidence);
      if (isNaN(confidence) || confidence < 0 || confidence > 1) {
        throw new Error(
          `Criterion "${c.name}" has invalid confidence "${c.confidence}". Confidence must be between 0.0 and 1.0.`
        );
      }

      if (!c.evidence || typeof c.evidence !== "string" || c.evidence.trim().length === 0) {
        throw new Error(`Criterion "${c.name}" is missing required 'evidence' text.`);
      }

      if (!c.concern || typeof c.concern !== "string" || c.concern.trim().length === 0) {
        throw new Error(`Criterion "${c.name}" is missing required 'concern' text.`);
      }

      if (!c.suggestion || typeof c.suggestion !== "string" || c.suggestion.trim().length === 0) {
        throw new Error(`Criterion "${c.name}" is missing required 'suggestion' text.`);
      }
    }

    if (!data.overallSummary || typeof data.overallSummary !== "string" || data.overallSummary.trim().length === 0) {
      throw new Error("AI response missing required 'overallSummary' string.");
    }

    if (!Array.isArray(data.strengths) || data.strengths.length === 0) {
      throw new Error("AI response must include a non-empty 'strengths' array.");
    }

    if (!Array.isArray(data.improvements) || data.improvements.length === 0) {
      throw new Error("AI response must include a non-empty 'improvements' array.");
    }
  }
}

export const aiEvaluator = new AIEvaluator();
