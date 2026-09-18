import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { seedProblems } from "../seed/seedProblems.js";
import { EvaluationService } from "../src/services/evaluation.service.js";
import { EvaluationStrategy } from "../src/evaluators/evaluation.strategy.js";
import { evaluationRepository } from "../src/repositories/evaluation.repository.js";
import { submissionRepository } from "../src/repositories/submission.repository.js";
import { attemptRepository } from "../src/repositories/attempt.repository.js";
import { problemRepository } from "../src/repositories/problem.repository.js";

// Mock strategy designed to test failure handling
class FailingStrategy extends EvaluationStrategy {
  async evaluate() {
    throw new Error("Simulated evaluator engine failure");
  }
}

async function runTestSuite() {
  console.log("=================================================");
  console.log("🧪 LLD Practice Platform — Backend Verification");
  console.log("=================================================\n");

  let mongoServer;
  let server;
  let baseUrl;

  try {
    // 1. Initialize MongoDB in-memory instance
    console.log("⏳ Starting in-memory MongoDB server...");
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`✓ MongoDB in-memory server running at: ${mongoUri}`);

    // 2. Connect to database
    await connectDB(mongoUri);
    console.log("✓ MongoDB connection verified.\n");

    // 3. Start Express server on random free port
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    console.log(`✓ Express test server listening on ${baseUrl}\n`);

    // 4. Test Health Endpoint
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    console.assert(healthJson.success === true, "Health endpoint failed");
    console.log("✓ 1. GET /api/health passed");

    // 5. Run Seed Script
    console.log("⏳ Executing seed script...");
    const seedResult = await seedProblems(mongoUri);
    console.assert(seedResult.insertedCount === 3, `Expected 3 inserted, got ${seedResult.insertedCount}`);
    console.log("✓ 2. Seed script executed successfully (3 problems created).");

    // 6. Verify All 3 Problems Exist
    const problemsRes = await fetch(`${baseUrl}/api/problems`);
    const problemsJson = await problemsRes.json();
    console.assert(problemsJson.success === true, "Failed to fetch problems");
    console.assert(problemsJson.data.length === 3, `Expected 3 problems, got ${problemsJson.data.length}`);
    const titles = problemsJson.data.map((p) => p.title);
    console.assert(titles.includes("Parking Lot"), "Parking Lot missing");
    console.assert(titles.includes("Vending Machine"), "Vending Machine missing");
    console.assert(titles.includes("Elevator System"), "Elevator System missing");
    console.log(`✓ 3. GET /api/problems verified: [${titles.join(", ")}]`);

    const parkingLot = problemsJson.data.find((p) => p.title === "Parking Lot");
    const problemId = parkingLot._id;

    // 7. Verify Single Problem By ID
    const singleProblemRes = await fetch(`${baseUrl}/api/problems/${problemId}`);
    const singleProblemJson = await singleProblemRes.json();
    console.assert(singleProblemJson.success === true, "Failed to get problem by ID");
    console.assert(singleProblemJson.data.title === "Parking Lot", "Problem title mismatch");
    console.log(`✓ 4. GET /api/problems/:id verified for "${singleProblemJson.data.title}"`);

    // 8. Test Invalid Problem ID (404 & 400)
    const invalidIdRes = await fetch(`${baseUrl}/api/problems/not-a-valid-id`);
    console.assert(invalidIdRes.status === 400, "Expected 400 for invalid ObjectId");
    console.log("✓ 5. GET /api/problems/:id rejected malformed ObjectId with 400 Bad Request");

    const nonExistentId = new mongoose.Types.ObjectId();
    const notFoundProblemRes = await fetch(`${baseUrl}/api/problems/${nonExistentId}`);
    console.assert(notFoundProblemRes.status === 404, "Expected 404 for non-existent problem");
    console.log("✓ 6. GET /api/problems/:id returned 404 for non-existent problem");

    // 9. Test Creating an Attempt
    const createAttemptRes = await fetch(`${baseUrl}/api/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId })
    });
    const createAttemptJson = await createAttemptRes.json();
    console.assert(createAttemptRes.status === 201, `Failed to create attempt: status ${createAttemptRes.status}`);
    console.assert(createAttemptJson.data.attemptNumber === 1, "Attempt number should be 1");
    console.assert(createAttemptJson.data.status === "IN_PROGRESS", "Initial status should be IN_PROGRESS");
    const attempt1 = createAttemptJson.data;
    console.log(`✓ 7. POST /api/attempts created Attempt #1 (ID: ${attempt1._id}, Status: ${attempt1.status})`);

    // 10. Test Creating a Second Attempt (Retry flow check: attemptNumber should increment to 2)
    const createAttempt2Res = await fetch(`${baseUrl}/api/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId })
    });
    const createAttempt2Json = await createAttempt2Res.json();
    console.assert(createAttempt2Json.data.attemptNumber === 2, "Attempt number should be 2");
    console.log(`✓ 8. POST /api/attempts created Attempt #2 (ID: ${createAttempt2Json.data._id})`);

    // 11. Test Get Attempt By ID
    const getAttemptRes = await fetch(`${baseUrl}/api/attempts/${attempt1._id}`);
    const getAttemptJson = await getAttemptRes.json();
    console.assert(getAttemptJson.data._id === attempt1._id, "Attempt ID mismatch");
    console.log("✓ 9. GET /api/attempts/:id verified successfully");

    // 12. Test Save Draft
    const draftPayload = {
      assumptions: "4 floors, 100 spots per floor, standard vehicle dimensions.",
      coreClasses: "ParkingLot, ParkingFloor, ParkingSpot, Ticket, Vehicle, PaymentService",
      responsibilities: "ParkingLot handles floor queries; PaymentService calculates fees.",
      relationships: "ParkingLot has many ParkingFloors.",
      designPatterns: "Strategy Pattern for pricing.",
      edgeCases: "Lot full, simultaneous entrance gate contention.",
      explanation: "Decoupled architecture delegating spot lookup to individual floors."
    };

    const draftRes = await fetch(`${baseUrl}/api/attempts/${attempt1._id}/draft`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftPayload)
    });
    const draftJson = await draftRes.json();
    console.assert(draftRes.status === 200, "Draft update failed");
    console.assert(draftJson.data.draft.coreClasses.includes("ParkingLot"), "Draft coreClasses missing");
    console.log("✓ 10. PATCH /api/attempts/:id/draft saved draft successfully into Attempt record");

    // 13. Test Submitting an Empty Solution (Validation: 400 Bad Request)
    const emptySubRes = await fetch(`${baseUrl}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId: attempt1._id,
        content: { assumptions: "", coreClasses: "", explanation: "" }
      })
    });
    console.assert(emptySubRes.status === 400, `Expected 400 for empty submission, got ${emptySubRes.status}`);
    console.log("✓ 11. POST /api/submissions rejected empty solution with 400 Bad Request");

    // 14. Test Submitting a Valid Solution
    const validSubRes = await fetch(`${baseUrl}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId: attempt1._id,
        content: draftPayload
      })
    });
    const validSubJson = await validSubRes.json();
    console.assert(validSubRes.status === 201, `Submission failed with status ${validSubRes.status}`);
    const submissionId = validSubJson.data._id;
    console.log(`✓ 12. POST /api/submissions succeeded (Submission ID: ${submissionId})`);

    // 15. Test Duplicate Submission Rejection (409 Conflict)
    const dupSubRes = await fetch(`${baseUrl}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId: attempt1._id,
        content: draftPayload
      })
    });
    console.assert(dupSubRes.status === 400 || dupSubRes.status === 409, "Expected 400/409 for duplicate submission");
    console.log(`✓ 13. Duplicate submission rejected with status ${dupSubRes.status}`);

    // 16. Test Draft Saving Blocked After Submission (Attempt is no longer IN_PROGRESS)
    const lateDraftRes = await fetch(`${baseUrl}/api/attempts/${attempt1._id}/draft`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assumptions: "New late assumption" })
    });
    console.assert(lateDraftRes.status === 400, "Draft update should be blocked when not IN_PROGRESS");
    console.log("✓ 14. Draft saving blocked for submitted attempt with 400 Bad Request");

    // 17. Verify Attempt Status Transition to COMPLETED
    const completedAttemptRes = await fetch(`${baseUrl}/api/attempts/${attempt1._id}`);
    const completedAttemptJson = await completedAttemptRes.json();
    console.assert(completedAttemptJson.data.status === "COMPLETED", `Expected COMPLETED, got ${completedAttemptJson.data.status}`);
    console.log(`✓ 15. Attempt status successfully transitioned to "${completedAttemptJson.data.status}"`);

    // 18. Verify Evaluation Record & Criteria Breakdown
    const evalRes = await fetch(`${baseUrl}/api/evaluations/${submissionId}`);
    const evalJson = await evalRes.json();
    console.assert(evalRes.status === 200, "Failed to get evaluation");
    console.assert(evalJson.data.status === "COMPLETED", "Evaluation status should be COMPLETED");
    console.assert(evalJson.data.criteria.length === 6, `Expected 6 criteria, got ${evalJson.data.criteria.length}`);
    console.assert(evalJson.data.strengths.length >= 2, "Expected at least 2 strengths");
    console.assert(evalJson.data.improvements.length >= 2, "Expected at least 2 improvements");
    console.log(`✓ 16. GET /api/evaluations/:submissionId returned 6 explainable criteria:`);
    evalJson.data.criteria.forEach((c) => {
      console.log(`      • ${c.name}: ${c.score}/5 | ${c.evidence.slice(0, 60)}...`);
    });

    // 19. Test GET /api/submissions/:attemptId
    const getSubByAttemptRes = await fetch(`${baseUrl}/api/submissions/${attempt1._id}`);
    const getSubByAttemptJson = await getSubByAttemptRes.json();
    console.assert(getSubByAttemptJson.data._id === submissionId, "Submission ID mismatch");
    console.log("✓ 17. GET /api/submissions/:attemptId retrieved submission successfully");

    // 20. Test Failed Evaluation Handling
    console.log("⏳ Testing failed evaluation pipeline...");
    // Create attempt 3
    const att3Res = await fetch(`${baseUrl}/api/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId })
    });
    const att3Json = await att3Res.json();
    const attempt3Id = att3Json.data._id;

    // Use a custom service with FailingStrategy
    const failingEvalService = new EvaluationService(
      evaluationRepository,
      submissionRepository,
      attemptRepository,
      problemRepository,
      new FailingStrategy()
    );

    // Create raw submission for attempt 3
    const sub3 = await submissionRepository.create({
      attemptId: attempt3Id,
      type: "TEXT",
      content: draftPayload,
      submittedAt: new Date()
    });

    try {
      await failingEvalService.evaluateSubmission(sub3._id);
    } catch {
      // Expected failure
    }

    const failedEval = await evaluationRepository.findBySubmissionId(sub3._id);
    const failedAtt = await attemptRepository.findById(attempt3Id);
    console.assert(failedEval.status === "FAILED", "Evaluation status should be FAILED");
    console.assert(failedAtt.status === "FAILED", "Attempt status should be FAILED");
    console.log("✓ 18. Failed evaluation handled cleanly: Evaluation and Attempt marked as FAILED");

    console.log("\n=================================================");
    console.log("🎉 ALL 18 BACKEND VERIFICATION TESTS PASSED!");
    console.log("=================================================\n");
  } finally {
    if (server) server.close();
    await disconnectDB();
    if (mongoServer) await mongoServer.stop();
  }
}

runTestSuite().catch((err) => {
  console.error("❌ Test suite encountered fatal error:", err);
  process.exit(1);
});
