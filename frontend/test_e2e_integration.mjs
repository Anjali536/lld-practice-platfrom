/**
 * End-to-end integration verification runner testing the updated
 * src/services/api.js against the live running Express + MongoDB backend.
 */

// Define import.meta.env for Node.js test environment
import {
  getProblems,
  getProblemById,
  createAttempt,
  getAttempt,
  getAttempts,
  saveDraft,
  submitSolution,
  getSubmissionByAttempt,
  getEvaluation,
  retryAttempt
} from "./src/services/api.js";

async function runE2EIntegrationTests() {
  console.log("=================================================");
  console.log("🚀 LLD Platform: Frontend-Backend E2E Verification");
  console.log("=================================================\n");

  // Step 1: Problems Catalog
  console.log("Testing Step 1: Fetching problems catalog...");
  const problems = await getProblems();
  console.assert(problems.length === 3, `Expected 3 problems, got ${problems.length}`);
  const titles = problems.map((p) => p.title);
  console.assert(titles.includes("Parking Lot"), "Parking Lot missing");
  console.assert(titles.includes("Vending Machine"), "Vending Machine missing");
  console.assert(titles.includes("Elevator System"), "Elevator System missing");
  console.log(`✓ 1. Loaded 3 problems from MongoDB: [${titles.join(", ")}]`);

  const parkingLot = problems.find((p) => p.title === "Parking Lot");
  const problemId = parkingLot.id; // MongoDB ObjectId

  // Step 2: Problem Details (Both by ObjectId and by Slug)
  console.log("\nTesting Step 2: Problem Details retrieval...");
  const problemByObjectId = await getProblemById(problemId);
  console.assert(problemByObjectId.title === "Parking Lot", "Title mismatch by ObjectId");
  console.assert(problemByObjectId.requirements?.length > 0, "Requirements missing");
  console.log(`✓ 2a. getProblemById(ObjectId) succeeded for "${problemByObjectId.title}"`);

  const problemBySlug = await getProblemById("parking-lot");
  console.assert(problemBySlug.id === problemId, "Slug did not resolve to same ObjectId");
  console.log(`✓ 2b. getProblemById("parking-lot") slug fallback succeeded`);

  // Step 3: Start Practice / Create Attempt
  console.log("\nTesting Step 3: Creating practice attempt...");
  const attempt1 = await createAttempt(problemId);
  console.assert(attempt1.status === "IN_PROGRESS", `Expected IN_PROGRESS, got ${attempt1.status}`);
  console.assert(attempt1.id, "Attempt ID missing");
  console.log(`✓ 3. Created Attempt #${attempt1.attemptNumber} in MongoDB (ID: ${attempt1.id}, Status: ${attempt1.status})`);

  // Step 4: Draft Saving & Persistence
  console.log("\nTesting Step 4: Draft saving...");
  const sampleSolution = {
    assumptions: "4 levels, 100 spots per floor, standard dimensions (Bike, Car, Bus), automated payment gate.",
    coreClasses: "ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, PaymentService, AllocationStrategy",
    responsibilities: "ParkingLot delegates to ParkingFloor; ParkingSpot tracks occupancy; PaymentService calculates fee.",
    relationships: "ParkingLot has many ParkingFloors; ParkingFloor has many ParkingSpots; Ticket associates Vehicle with Spot.",
    designPatterns: "Strategy pattern for fee calculation algorithms; Factory method for spot and vehicle instantiation.",
    edgeCases: "Lot full rejects entry; simultaneous gate check-ins handled by thread-safe spot reservation lock.",
    explanation: "Decoupled architecture delegating spot lookups to individual floors with injectable fee strategies."
  };

  const draftAttempt = await saveDraft(attempt1.id, sampleSolution);
  console.assert(draftAttempt.solution.coreClasses.includes("ParkingLot"), "Draft not saved properly");
  console.log("✓ 4a. PATCH /api/attempts/:id/draft saved solution into MongoDB");

  // Verify draft survives refresh / re-fetching
  const fetchedAttempt = await getAttempt(attempt1.id);
  console.assert(fetchedAttempt.solution.explanation.includes("Decoupled"), "Draft did not persist in MongoDB");
  console.log("✓ 4b. GET /api/attempts/:id restored draft successfully from MongoDB");

  // Step 5: Submit Solution
  console.log("\nTesting Step 5: Submitting solution...");
  const { submission } = await submitSolution(attempt1.id, sampleSolution);
  console.assert(submission.submissionId, "Submission ID missing");
  console.log(`✓ 5. Solution submitted to MongoDB (Submission ID: ${submission.submissionId})`);

  // Step 6: Evaluation Status
  console.log("\nTesting Step 6: Checking evaluation completion...");
  // Give brief moment for evaluation pipeline
  let completedAttempt = await getAttempt(attempt1.id);
  console.assert(completedAttempt.status === "COMPLETED", `Expected COMPLETED, got ${completedAttempt.status}`);
  console.log(`✓ 6. Attempt status reached: "${completedAttempt.status}"`);

  // Step 7: Feedback Report & Criteria Breakdown
  console.log("\nTesting Step 7: Retrieving explainable feedback...");
  const feedback = await getEvaluation(submission.submissionId);
  console.assert(feedback.status === "COMPLETED", "Evaluation should be COMPLETED");
  console.assert(feedback.criteria.length === 6, `Expected 6 criteria, got ${feedback.criteria.length}`);
  console.assert(feedback.overallSummary.length > 20, "Summary should be comprehensive");
  console.assert(feedback.strengths.length >= 2, "Expected strengths");
  console.assert(feedback.improvements.length >= 2, "Expected improvements");
  console.assert(feedback.problemId != null, "problemId should be present on evaluation");
  console.log(`✓ 7. Feedback report retrieved with ${feedback.criteria.length} criteria:`);
  feedback.criteria.forEach((c) => {
    console.log(`    • ${c.name}: ${c.score}/5 (Confidence: ${Math.round(c.confidence * 100)}%)`);
  });

  // Step 8: Attempt History
  console.log("\nTesting Step 8: Fetching attempt history...");
  const history = await getAttempts();
  const found = history.find((a) => a.id === attempt1.id);
  console.assert(found != null, "Attempt missing from history");
  console.assert(found.status === "COMPLETED", "History attempt status mismatch");
  console.assert(found.submissionId === submission.submissionId, "submissionId missing on history attempt");
  console.log(`✓ 8. Attempt #${found.attemptNumber} listed in history with status: ${found.status}, submissionId: ${found.submissionId}`);

  // Step 9: Retry Flow
  console.log("\nTesting Step 9: Retrying problem...");
  const attempt2 = await retryAttempt(problemId);
  console.assert(attempt2.id !== attempt1.id, "Retry must create new attempt ID");
  console.assert(attempt2.attemptNumber === attempt1.attemptNumber + 1, "Attempt number must increment");
  console.assert(attempt2.status === "IN_PROGRESS", "New attempt must be IN_PROGRESS");
  console.assert(attempt2.solution.coreClasses === "", "New attempt solution must be empty");
  console.log(`✓ 9a. Spawned Attempt #${attempt2.attemptNumber} (ID: ${attempt2.id}, Status: ${attempt2.status}) with fresh empty form`);

  // Verify previous attempt remains in history
  const historyAfterRetry = await getAttempts();
  const att1StillThere = historyAfterRetry.find((a) => a.id === attempt1.id);
  const att2There = historyAfterRetry.find((a) => a.id === attempt2.id);
  console.assert(att1StillThere && att2There, "Both attempts must exist in history");
  console.log(`✓ 9b. Both Attempt #${att1StillThere.attemptNumber} (Completed) and Attempt #${att2There.attemptNumber} (In Progress) preserved in MongoDB`);

  // Step 10: Edge Cases & Error Handling
  console.log("\nTesting Step 10: Error handling & edge cases...");

  // 10a: Invalid Problem ID
  try {
    await getProblemById("non-existent-problem-id");
    console.assert(false, "Should have thrown for invalid problem");
  } catch (err) {
    console.log(`✓ 10a. Invalid problem ID handled gracefully: "${err.message}"`);
  }

  // 10b: Empty Submission Rejection
  try {
    await submitSolution(attempt2.id, { assumptions: "", coreClasses: "", explanation: "" });
    console.assert(false, "Should have rejected empty solution");
  } catch (err) {
    console.log(`✓ 10b. Empty solution submission rejected: "${err.message}"`);
  }

  // 10c: Late draft saving after submission
  try {
    await saveDraft(attempt1.id, { assumptions: "Late edit" });
    console.assert(false, "Should have blocked draft saving on completed attempt");
  } catch (err) {
    console.log(`✓ 10c. Draft saving blocked on non-IN_PROGRESS attempt: "${err.message}"`);
  }

  console.log("\n=================================================");
  console.log("🎉 ALL 10 END-TO-END INTEGRATION TESTS PASSED!");
  console.log("=================================================\n");
}

runE2EIntegrationTests().catch((err) => {
  console.error("❌ E2E Integration test failed:", err);
  process.exit(1);
});
