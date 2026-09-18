// Mock browser localStorage for Node.js test
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; }
};

import {
  getProblems,
  getProblemById,
  getAttempts,
  createAttempt,
  saveDraft,
  submitSolution,
  processEvaluation,
  getEvaluation,
  retryAttempt
} from "./src/services/api.js";

async function runTests() {
  console.log("🚀 Starting LLD Practice Platform Flow Verification...");

  // 1. Problems List
  const problems = await getProblems();
  if (problems.length !== 3) throw new Error(`Expected 3 problems, got ${problems.length}`);
  console.log(`✓ 1. Loaded ${problems.length} problems:`, problems.map(p => p.title).join(", "));

  // 2. Problem Details
  const p1 = await getProblemById("parking-lot");
  if (p1.title !== "Parking Lot") throw new Error("Problem title mismatch");
  if (!p1.requirements?.length) throw new Error("No requirements found");
  console.log(`✓ 2. Loaded details for "${p1.title}" with ${p1.requirements.length} requirements.`);

  // 3. Create Attempt
  const attempt1 = await createAttempt("parking-lot");
  if (attempt1.status !== "IN_PROGRESS") throw new Error("Attempt status should be IN_PROGRESS");
  console.log(`✓ 3. Created Attempt #${attempt1.attemptNumber} (ID: ${attempt1.id}, Status: ${attempt1.status})`);

  // 4. Save Draft
  const testSolution = {
    assumptions: "4 levels, standard vehicles, cashless payment",
    coreClasses: "ParkingLot, ParkingFloor, ParkingSpot, Ticket, PaymentService",
    responsibilities: "ParkingLot coordinates; ParkingFloor manages spots; PaymentService calculates fee",
    relationships: "ParkingLot has Floors; Floor has Spots",
    designPatterns: "Strategy Pattern for fee calculation; Factory for spots",
    edgeCases: "Lot full, simultaneous gate entry",
    explanation: "Decoupled architecture delegating spot lookup to individual floors"
  };

  const draftAttempt = await saveDraft(attempt1.id, testSolution);
  if (!draftAttempt.solution.coreClasses.includes("ParkingLot")) throw new Error("Draft not saved properly");
  console.log("✓ 4. Successfully saved draft solution into localStorage.");

  // 5. Submit Solution
  const { attempt: submittedAtt, submission } = await submitSolution(attempt1.id, testSolution);
  if (submittedAtt.status !== "SUBMITTED") throw new Error("Attempt status should be SUBMITTED");
  if (!submission.submissionId) throw new Error("Submission ID missing");
  console.log(`✓ 5. Solution submitted! (Submission ID: ${submission.submissionId}, Status: ${submission.status})`);

  // 6. Simulate Evaluation Progression
  const evaluation = await processEvaluation(submission.submissionId);
  if (evaluation.status !== "COMPLETED") throw new Error("Evaluation should be COMPLETED");
  if (evaluation.criteria.length !== 6) throw new Error(`Expected 6 criteria, got ${evaluation.criteria.length}`);
  if (evaluation.strengths.length < 2) throw new Error("Expected strengths");
  if (evaluation.improvements.length < 2) throw new Error("Expected improvements");
  console.log(`✓ 6. Evaluation completed with ${evaluation.criteria.length} criteria:`);
  evaluation.criteria.forEach(c => {
    console.log(`   - ${c.name}: ${c.score}/5 (Confidence: ${Math.round(c.confidence * 100)}%)`);
  });

  // 7. Verify Attempt History
  const historyBeforeRetry = await getAttempts();
  const foundSubmitted = historyBeforeRetry.find(a => a.id === attempt1.id);
  if (foundSubmitted.status !== "COMPLETED") throw new Error("History attempt status mismatch");
  if (!foundSubmitted.summaryScores) throw new Error("Summary scores missing from history");
  console.log(`✓ 7. Verified History record: Attempt #${foundSubmitted.attemptNumber}, Status: ${foundSubmitted.status}, Score: ${foundSubmitted.summaryScores.overall}`);

  // 8. Retry Attempt
  const attempt2 = await retryAttempt("parking-lot");
  if (attempt2.id === attempt1.id) throw new Error("Retry should create new attempt ID");
  if (attempt2.attemptNumber !== foundSubmitted.attemptNumber + 1) throw new Error("Attempt number should increment");
  if (attempt2.status !== "IN_PROGRESS") throw new Error("New attempt should be IN_PROGRESS");
  console.log(`✓ 8. Retried problem: Spawned Attempt #${attempt2.attemptNumber} (ID: ${attempt2.id})`);

  // 9. Verify Both Attempts Persist in History
  const historyAfterRetry = await getAttempts();
  const att1StillThere = historyAfterRetry.find(a => a.id === attempt1.id);
  const att2There = historyAfterRetry.find(a => a.id === attempt2.id);
  if (!att1StillThere || !att2There) throw new Error("Both attempts must persist in history");
  console.log(`✓ 9. Both Attempt #${att1StillThere.attemptNumber} and Attempt #${att2There.attemptNumber} safely persisted in history.`);

  // 10. Verify Explainable Feedback Fetch
  const feedback = await getEvaluation(submission.submissionId);
  if (feedback.overallSummary.length < 20) throw new Error("Summary should be comprehensive");
  if (!feedback.criteria[0].evidence || !feedback.criteria[0].suggestion) throw new Error("Feedback must include evidence and suggestions");
  console.log(`✓ 10. Explainable feedback retrieved with evidence, concerns, and suggestions.`);

  console.log("\n🎉 ALL 10 USER JOURNEY CRITICAL PATH TESTS PASSED SUCCESSFULLY!");
}

runTests().catch(err => {
  console.error("Test failure:", err);
  process.exit(1);
});
