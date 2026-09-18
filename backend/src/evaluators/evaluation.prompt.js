/**
 * Prompt Builder for LLM-based LLD Evaluation
 *
 * Formulates structured instructions, system context, rubric definitions,
 * and learner input. Ensures objective assessment acknowledging multiple valid designs.
 */

export const EXPECTED_CRITERIA_NAMES = [
  "Requirement Understanding",
  "Responsibilities",
  "Encapsulation & Abstraction",
  "Coupling & Cohesion",
  "Extensibility",
  "Testability"
];

/**
 * Builds the system instruction prompt for the LLM.
 */
export function buildSystemPrompt() {
  return `You are a Principal Software Architect and seasoned Low-Level Design (LLD) interviewer.
Your task is to evaluate a learner's object-oriented system design solution against established criteria.

CRITICAL EVALUATION PRINCIPLES:
1. MULTIPLE VALID DESIGNS:
   There may be multiple valid LLD designs for the same problem.
   Do not compare the learner's design against one fixed reference implementation.
   Evaluate whether the submitted design satisfies the requirements and whether its abstractions, responsibilities, relationships, and trade-offs are reasonable.
   Do not penalize a learner merely because they chose a different valid design.

2. EVIDENCE-BASED ASSESSMENT:
   Every score must be backed by concrete evidence citing what the learner actually wrote.
   Avoid generic platitudes like "Good design" or "Follow SOLID principles". Be specific.

3. STRICT JSON OUTPUT:
   You must respond with valid JSON ONLY. Do not wrap in markdown quotes or preamble.`;
}

/**
 * Builds the user evaluation prompt combining problem specifications and learner submission.
 */
export function buildEvaluationPrompt(problem, submission) {
  const content = submission.content || {};

  const requirementsText = Array.isArray(problem.requirements)
    ? problem.requirements
        .map((r, i) => {
          if (typeof r === "string") return `${i + 1}. ${r}`;
          return `${i + 1}. [${r.category || "General"}] ${r.title}: ${r.description}`;
        })
        .join("\n")
    : "No explicit requirements provided.";

  const constraintsText = Array.isArray(problem.constraints) && problem.constraints.length > 0
    ? problem.constraints.map((c) => `- ${c}`).join("\n")
    : "No explicit constraints specified.";

  const considerationsText = Array.isArray(problem.designConsiderations) && problem.designConsiderations.length > 0
    ? problem.designConsiderations.map((c) => `- ${c}`).join("\n")
    : (Array.isArray(problem.considerations) ? problem.considerations.map((c) => `- ${c}`).join("\n") : "Standard OOD considerations.");

  return `### PROBLEM SPECIFICATION
Title: ${problem.title || "Low-Level Design Problem"}
Difficulty: ${problem.difficulty || "Medium"}
Description: ${problem.description || problem.fullDescription || ""}

Requirements:
${requirementsText}

Constraints:
${constraintsText}

Design Considerations:
${considerationsText}

---

### LEARNER'S SUBMITTED SOLUTION
1. Assumptions:
${content.assumptions || "(None provided)"}

2. Core Classes & Entities:
${content.coreClasses || "(None provided)"}

3. Responsibilities:
${content.responsibilities || "(None provided)"}

4. Relationships:
${content.relationships || "(None provided)"}

5. Design Patterns & Abstractions:
${content.designPatterns || "(None provided)"}

6. Edge Cases Handled:
${content.edgeCases || "(None provided)"}

7. Overall Explanation & Trade-offs:
${content.explanation || "(None provided)"}

---

### EVALUATION RUBRIC
Evaluate the solution across EXACTLY these 6 criteria:
1. "Requirement Understanding": Did the learner capture functional & non-functional requirements and operational boundaries?
2. "Responsibilities": Are class roles focused and cohesive according to the Single Responsibility Principle?
3. "Encapsulation & Abstraction": Are internal states protected? Are interfaces/abstract classes used appropriately?
4. "Coupling & Cohesion": Are components loosely coupled? Is dependency inversion or injection utilized?
5. "Extensibility": Can new requirements (e.g. new vehicle types, algorithms, states) be added without modifying core existing code (Open/Closed Principle)?
6. "Testability": Can key business logic, pricing, scheduling, or states be isolated and unit-tested without external friction?

---

### REQUIRED OUTPUT FORMAT
Output MUST be a single valid JSON object with EXACTLY this shape:
{
  "criteria": [
    {
      "name": "Requirement Understanding",
      "score": <integer 1 to 5>,
      "evidence": "<specific citation or observation from what learner wrote>",
      "concern": "<specific potential problem or gap>",
      "suggestion": "<actionable architectural improvement>",
      "confidence": <float between 0.70 and 0.99>
    },
    {
      "name": "Responsibilities",
      "score": <integer 1 to 5>,
      "evidence": "...",
      "concern": "...",
      "suggestion": "...",
      "confidence": <float>
    },
    {
      "name": "Encapsulation & Abstraction",
      "score": <integer 1 to 5>,
      "evidence": "...",
      "concern": "...",
      "suggestion": "...",
      "confidence": <float>
    },
    {
      "name": "Coupling & Cohesion",
      "score": <integer 1 to 5>,
      "evidence": "...",
      "concern": "...",
      "suggestion": "...",
      "confidence": <float>
    },
    {
      "name": "Extensibility",
      "score": <integer 1 to 5>,
      "evidence": "...",
      "concern": "...",
      "suggestion": "...",
      "confidence": <float>
    },
    {
      "name": "Testability",
      "score": <integer 1 to 5>,
      "evidence": "...",
      "concern": "...",
      "suggestion": "...",
      "confidence": <float>
    }
  ],
  "overallSummary": "<2-4 sentence executive summary evaluating the overall architectural maturity>",
  "strengths": [
    "<2-4 concise, evidence-backed strength bullets with specific design choices highlighted>"
  ],
  "improvements": [
    "<2-4 actionable, prioritized areas of improvement for the design>"
  ]
}`;
}
