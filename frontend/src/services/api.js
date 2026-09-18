/**
 * API Service Layer for LLD Practice Platform
 *
 * This layer is the single boundary between React components and the backend.
 * Connects to the Express REST API endpoints backed by MongoDB.
 */

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "http://localhost:5000/api";

export const emptySolution = {
  assumptions: "",
  coreClasses: "",
  responsibilities: "",
  relationships: "",
  designPatterns: "",
  edgeCases: "",
  explanation: ""
};

/**
 * Reusable HTTP request helper with JSON headers, status checking,
 * and meaningful error normalization.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message = json?.message || `Request failed with HTTP status ${res.status}`;
      const error = new Error(message);
      error.status = res.status;
      error.data = json;
      throw error;
    }

    return json?.data !== undefined ? json.data : json;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(
        "Network Error: Unable to connect to the backend API server. Please verify the backend is running on port 5000."
      );
    }
    throw err;
  }
}

/**
 * Normalizes problem document fields for UI compatibility
 */
function normalizeProblem(p) {
  if (!p) return null;
  const id = p._id || p.id;
  return {
    ...p,
    id,
    _id: id,
    shortDescription: p.shortDescription || p.description,
    fullDescription: p.fullDescription || p.description,
    requirementsCount: p.requirementsCount || p.requirements?.length || 0,
    considerations: p.designConsiderations || p.considerations || []
  };
}

/**
 * Normalizes attempt document fields for UI compatibility
 */
function normalizeAttempt(att) {
  if (!att) return null;
  const id = att._id || att.id;
  const probId = att.problemId?._id || att.problemId;
  const probTitle = att.problemId?.title || att.problemTitle || "System Design Problem";

  return {
    ...att,
    id,
    _id: id,
    problemId: probId,
    problemTitle: probTitle,
    solution: att.draft || att.solution || { ...emptySolution }
  };
}

/**
 * Fetch all available practice problems from MongoDB
 */
export async function getProblems() {
  const problems = await request("/problems");
  return problems.map(normalizeProblem);
}

/**
 * Fetch a single problem by ID (supports MongoDB ObjectId and slug fallback)
 */
export async function getProblemById(id) {
  // Check if id is a valid 24-char hex MongoDB ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isObjectId) {
    const problem = await request(`/problems/${id}`);
    return normalizeProblem(problem);
  }

  // Fallback slug mapping (e.g. "parking-lot", "vending-machine", "elevator-system")
  const allProblems = await getProblems();
  const matched = allProblems.find(
    (p) =>
      p.id === id ||
      p.title.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase() ||
      p.title.toLowerCase() === id.replace(/-/g, " ").toLowerCase()
  );

  if (matched) {
    return matched;
  }

  throw new Error(`Problem with ID or slug "${id}" was not found.`);
}

/**
 * Get all user attempts across all problems, sorted newest first
 */
export async function getAttempts() {
  const attempts = await request("/attempts");

  // Enrich completed attempts with submissionId and summary scores
  return Promise.all(
    attempts.map(async (att) => {
      const normalized = normalizeAttempt(att);
      if (normalized.status === "COMPLETED" && !normalized.submissionId) {
        try {
          const sub = await getSubmissionByAttempt(normalized.id);
          if (sub?._id) {
            normalized.submissionId = sub._id;
            try {
              const ev = await getEvaluation(sub._id);
              if (ev?.criteria) {
                const respCrit = ev.criteria.find((c) => c.name === "Responsibilities");
                const extCrit = ev.criteria.find((c) => c.name === "Extensibility");
                const avgScore = (
                  ev.criteria.reduce((acc, c) => acc + c.score, 0) / ev.criteria.length
                ).toFixed(1);
                normalized.summaryScores = {
                  responsibilities: respCrit ? respCrit.score : 4,
                  extensibility: extCrit ? extCrit.score : 3,
                  overall: `${avgScore}/5`
                };
              }
            } catch {
              // Evaluation lookup silent fallback
            }
          }
        } catch {
          // Submission lookup silent fallback
        }
      }
      return normalized;
    })
  );
}

/**
 * Get a specific attempt by ID
 */
export async function getAttempt(attemptId) {
  const attempt = await request(`/attempts/${attemptId}`);
  const normalized = normalizeAttempt(attempt);

  // If completed, attempt to attach submissionId
  if (normalized.status === "COMPLETED" && !normalized.submissionId) {
    try {
      const sub = await getSubmissionByAttempt(normalized.id);
      if (sub?._id) {
        normalized.submissionId = sub._id;
      }
    } catch {
      // ignore
    }
  }

  return normalized;
}

/**
 * Create a fresh attempt for a problem
 */
export async function createAttempt(problemId) {
  // If problemId is a slug, resolve its real ObjectId first
  let resolvedProblemId = problemId;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(problemId);
  if (!isObjectId) {
    const prob = await getProblemById(problemId);
    resolvedProblemId = prob._id || prob.id;
  }

  const attempt = await request("/attempts", {
    method: "POST",
    body: JSON.stringify({ problemId: resolvedProblemId })
  });

  return normalizeAttempt(attempt);
}

/**
 * Save draft solution for an ongoing attempt
 */
export async function saveDraft(attemptId, solutionData) {
  const updatedAttempt = await request(`/attempts/${attemptId}/draft`, {
    method: "PATCH",
    body: JSON.stringify(solutionData)
  });

  return normalizeAttempt(updatedAttempt);
}

/**
 * Submit solution for an attempt and trigger the evaluation pipeline
 */
export async function submitSolution(attemptId, solutionData) {
  const submission = await request("/submissions", {
    method: "POST",
    body: JSON.stringify({
      attemptId,
      content: solutionData
    })
  });

  const attempt = await getAttempt(attemptId);

  return {
    attempt,
    submission: {
      ...submission,
      submissionId: submission._id || submission.id
    }
  };
}

/**
 * Fetch submission record by attempt ID
 */
export async function getSubmissionByAttempt(attemptId) {
  return request(`/submissions/${attemptId}`);
}

/**
 * Fetch evaluation report by submission ID
 */
export async function getEvaluation(submissionId) {
  const evaluation = await request(`/evaluations/${submissionId}`);

  // Ensure problemId is present on evaluation for feedback actions & retry
  if (!evaluation.problemId) {
    const sub = evaluation.submissionId;
    if (sub?.attemptId?.problemId) {
      evaluation.problemId = sub.attemptId.problemId._id || sub.attemptId.problemId;
    } else if (sub?.attemptId) {
      try {
        const att = await getAttempt(sub.attemptId._id || sub.attemptId);
        evaluation.problemId = att.problemId;
      } catch {
        // ignore
      }
    }
  }

  return {
    ...evaluation,
    submissionId: evaluation.submissionId?._id || evaluation.submissionId || submissionId
  };
}

/**
 * Retry a problem by creating a brand-new attempt
 */
export async function retryAttempt(problemId) {
  return createAttempt(problemId);
}
