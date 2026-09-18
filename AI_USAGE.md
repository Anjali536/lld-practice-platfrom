# AI Architectural Decisions & Usage Log

This document records the key architectural decisions shaped during the design and implementation of the LLD Practice Platform, specifically regarding automated reasoning, evaluation strategies, and system resilience.

---

### Decision 1 — Structured, Evidence-Backed Evaluation Schema

- **What AI Suggested:**
  Instead of asking the LLM or evaluator to output a single holistic score (e.g. "82/100") or a free-form essay, enforce a fixed JSON schema structured around 6 core Low-Level Design dimensions:
  1. *Requirement Understanding*
  2. *Responsibilities*
  3. *Encapsulation & Abstraction*
  4. *Coupling & Cohesion*
  5. *Extensibility*
  6. *Testability*
  Each criterion must independently return a score (1–5), evidence from the learner's text, an architectural concern, a concrete suggestion, and a confidence rating (0.0–1.0).

- **What Was Accepted:**
  Adopted the exact 6-criteria JSON schema across both `RuleEvaluator` and `AIEvaluator`.

- **Why:**
  In Low-Level Design, arbitrary scores without evidence frustrate learners and lack educational value. Structured outputs guarantee explainable feedback, enable radar/breakdown visual representations in the UI, and allow direct comparisons across repeated attempts.

---

### Decision 2 — Extensible Evaluation via the Strategy Pattern

- **What AI Suggested:**
  Decouple the submission pipeline from the evaluation engine using the classic Gang of Four **Strategy Pattern**. `EvaluationService` should programmatically depend on an abstract `EvaluationStrategy` base class rather than binding directly to a rule engine or an external AI API.

- **What Was Accepted:**
  Created `EvaluationStrategy` with `evaluate(submission, problem)` as a contract, and implemented both `RuleEvaluator` and `AIEvaluator` as pluggable strategies selected via `EVALUATION_MODE`.

- **Why:**
  This fulfills the open/closed principle: new evaluation engines (e.g., fine-tuned models, human peer review, static code analyzers) can be introduced without touching the `SubmissionService`, database repositories, or React frontend routes.

---

### Decision 3 — Coexistence of Deterministic Rules and LLM Reasoning

- **What AI Suggested:**
  Do not discard rule-based evaluation when introducing AI. Maintain a deterministic baseline engine that can run fully offline with zero external credentials or network dependencies, and layer the LLM evaluator as an opt-in reasoning engine.

- **What Was Accepted:**
  Preserved `RuleEvaluator` as the default mode (`EVALUATION_MODE=rule`) and created `AIEvaluator` for `EVALUATION_MODE=ai`.

- **Why:**
  Rule-based heuristics provide instantaneous, zero-cost, deterministic feedback suitable for CI/CD pipelines and local test suites. The LLM engine provides nuanced semantic reasoning capable of interpreting unconventional class names, design metaphors, and trade-off rationales. Neither replaces the other; both are valuable.

---

### Decision 4 — Strict Pre-Persistence Validation of AI Responses

- **What AI Suggested:**
  Treat LLM outputs as untrusted third-party inputs. Implement strict schema and semantic validation before committing any evaluation payload to MongoDB.

- **What Was Accepted:**
  Implemented `AIEvaluator.validateResponse()` which validates:
  - Exact criteria count (precisely 6 items).
  - Exact criterion naming matching the rubric.
  - Integer score constraints ($1 \le \text{score} \le 5$).
  - Confidence constraints ($0.0 \le \text{confidence} \le 1.0$).
  - Non-empty evidence, concern, and suggestion string attributes.
  - Overall summary, strengths, and improvements presence.

- **Why:**
  LLMs can occasionally hallucinate extra criteria, omit keys, or return float/out-of-bounds scores. Failing early and explicitly preserves database integrity and prevents UI crashes on the feedback screen.

---

### Decision 5 — Transparent Failure Behavior Without Silent Degradation

- **What AI Suggested:**
  When `EVALUATION_MODE=ai` is enabled and the LLM provider fails (due to rate limits, invalid API keys, timeout, or malformed JSON), do **not** silently fall back to `RuleEvaluator` and pretend the AI succeeded.

- **What Was Accepted:**
  Persist the learner's `Submission` first, transition the `Attempt` to `EVALUATING`, and if the AI call fails, explicitly mark both `Evaluation` and `Attempt` as `FAILED`.

- **Why:**
  Silent fallback masks API outages, creates confusing debugging scenarios, and misleads learners about whether their design received AI reasoning or keyword matching. Saving the submission prior to evaluation ensures zero work is lost, allowing the learner to retry whenever the provider recovers.

---

### Decision 6 — Explicit Instructions Acknowledging Multiple Valid Designs

- **What AI Suggested:**
  Include explicit negative constraints in the evaluation system prompt instructing the model that Low-Level Design does not have a single "canonical" solution.

- **What Was Accepted:**
  Injected prompt instructions stating:
  > *"There may be multiple valid LLD designs for the same problem. Do not compare the learner's design against one fixed reference implementation. Evaluate whether the submitted design satisfies the requirements and whether its abstractions, responsibilities, relationships, and trade-offs are reasonable. Do not penalize a learner merely because they chose a different valid design."*

- **Why:**
  Prevents models from biasing toward textbook patterns (e.g., demanding a Singleton for `ParkingLot` when a dependency-injected controller is equally or more valid).
