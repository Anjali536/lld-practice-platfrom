# LLD Practice Platform — Backend Foundation

A clean, modular Node.js / Express monolith providing the API, persistence foundation, and dual-mode evaluation pipeline (Deterministic Rules + AI Reasoning) for the Low-Level Design (LLD) practice platform.

---

## 1. Architecture

The backend follows a layered separation of concerns:

```text
HTTP Request
     ↓
Routes                     (Defines endpoints & binds middleware)
     ↓
Controllers                (Extracts parameters, formats HTTP JSON responses)
     ↓
Services                   (Domain business logic, validation, state flow)
     ↓
Repositories               (Abstracts all database / Mongoose queries)
     ↓
Mongoose Models            (Schema validation & types)
     ↓
MongoDB
```

### Pluggable Evaluation Strategy Pipeline
```text
SubmissionService
       ↓
EvaluationService
       ↓
selectEvaluationStrategy()
       ↓
EvaluationStrategy (Abstract Contract)
   ├── RuleEvaluator   (Deterministic OOD keyword & heuristic rubric)
   └── AIEvaluator     (LLM reasoning via OpenAI-compatible LLMClient)
       ↓
MongoDB (Evaluation Collection)
```

---

## 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lld_practice_platform
CLIENT_ORIGIN=http://localhost:5173

# Evaluation mode: 'rule' (default, zero external dependencies) or 'ai' (LLM-based)
EVALUATION_MODE=rule

# AI Evaluation Provider Configuration (only required if EVALUATION_MODE=ai)
LLM_API_KEY=your_llm_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
```

> **Security Note**: Never commit `LLM_API_KEY` to source control. Vite environment variables (`VITE_*`) are never used for backend secrets.

---

## 3. Evaluation Modes

### Mode A: Rule-Based Evaluation (Default)
- Configured with `EVALUATION_MODE=rule`.
- Requires **no external API keys** and runs completely offline.
- Deterministically analyzes the 7 solution fields for class abstractions, interface boundaries, behavioral patterns, decoupling, concurrency guards, and test seams.

### Mode B: AI-Assisted Evaluation (LLM Reasoning)
- Configured with `EVALUATION_MODE=ai` and valid `LLM_API_KEY`.
- Compiles the problem brief, requirements, constraints, and the learner's 7-section submission into an instruction prompt.
- Sends the prompt to any OpenAI-compatible completions endpoint (`gpt-4o-mini`, `gemini-2.5-flash`, etc.).
- Evaluates against the identical 6 criteria:
  1. *Requirement Understanding*
  2. *Responsibilities*
  3. *Encapsulation & Abstraction*
  4. *Coupling & Cohesion*
  5. *Extensibility*
  6. *Testability*
- Explicitly instructed that **multiple valid designs exist** and not to penalize alternative valid architectures.
- Strictly validates JSON responses before database persistence (score range 1–5, confidence 0–1, exactly 6 named criteria).

### Transparent Failure Handling
If `EVALUATION_MODE=ai` is enabled and the LLM call fails (e.g. rate limit, invalid key, timeout, or malformed JSON):
1. The learner's `Submission` is safely retained in MongoDB.
2. The `Evaluation` and `Attempt` records are marked as `FAILED`.
3. The system does **not** silently fall back to `RuleEvaluator`, ensuring complete behavioral transparency.
4. The learner can retry without loss of work.

---

## 4. Getting Started

### Install Dependencies
```bash
cd backend
npm install
```

### Seed Database
Populates the 3 core LLD problems (*Parking Lot*, *Vending Machine*, *Elevator System*) idempotently:
```bash
npm run seed
```

### Start Server
```bash
npm start
# or for auto-restart
npm run dev
```

### Run Automated Verification Suite
Runs the comprehensive test suite (18 backend integration tests + 7 AI evaluator tests + AI service integration tests) completely offline without requiring an external API key:
```bash
npm test
```

---

## 5. API Endpoints

### Problems
- `GET /api/problems` — Fetch all practice problems
- `GET /api/problems/:id` — Fetch single problem by ID

### Attempts
- `POST /api/attempts` — Create a new attempt (`{ problemId }`)
- `GET /api/attempts` — Get all attempts (optional query `?problemId=...`)
- `GET /api/attempts/:id` — Get attempt by ID
- `PATCH /api/attempts/:id/draft` — Save draft solution for `IN_PROGRESS` attempt

### Submissions
- `POST /api/submissions` — Submit solution (`{ attemptId, content }`), triggers evaluation
- `GET /api/submissions/:attemptId` — Get submission for an attempt

### Evaluations
- `GET /api/evaluations/:submissionId` — Get evaluation report with scores, evidence, concerns, suggestions, and evaluator metadata (`evaluatorType: "RULE" | "AI"`)
