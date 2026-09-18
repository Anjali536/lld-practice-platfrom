import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { seedProblems } from "../seed/seedProblems.js";
import { EvaluationService } from "../src/services/evaluation.service.js";
import { AIEvaluator } from "../src/evaluators/ai.evaluator.js";
import { MockLLMClient } from "../src/evaluators/llm.client.js";
import { evaluationRepository } from "../src/repositories/evaluation.repository.js";
import { submissionRepository } from "../src/repositories/submission.repository.js";
import { attemptRepository } from "../src/repositories/attempt.repository.js";
import { problemRepository } from "../src/repositories/problem.repository.js";

const sampleAIResponse = {
  criteria: [
    {
      name: "Requirement Understanding",
      score: 5,
      evidence: "Addressed multi-tier vehicle support and concurrency at entrance terminals.",
      concern: "Potential bottleneck if gates share a single unpartitioned lock.",
      suggestion: "Partition spot locking per floor or spot cluster.",
      confidence: 0.94
    },
    {
      name: "Responsibilities",
      score: 4,
      evidence: "ParkingLot acts as an orchestrator while ParkingFloor manages local spot states.",
      concern: "ParkingLot still retains direct ticket duration timestamp logic.",
      suggestion: "Delegate ticket duration calculation entirely to ParkingTicket.",
      confidence: 0.89
    },
    {
      name: "Encapsulation & Abstraction",
      score: 4,
      evidence: "Vehicle and Spot hierarchies abstract physical dimensions cleanly.",
      concern: "Ticket exposes internal spot reference directly.",
      suggestion: "Encapsulate spot ID as an opaque string token.",
      confidence: 0.86
    },
    {
      name: "Coupling & Cohesion",
      score: 4,
      evidence: "Fee computation is decoupled behind a Strategy interface.",
      concern: "Direct instantiation inside ParkingLot.",
      suggestion: "Inject pricing strategy via dependency injection container.",
      confidence: 0.88
    },
    {
      name: "Extensibility",
      score: 5,
      evidence: "Adding new parking spot types or tariff schedules requires zero changes to core coordinators.",
      concern: "Adding spot amenities requires extending spot capabilities.",
      suggestion: "Use a capability tag set on ParkingSpot.",
      confidence: 0.92
    },
    {
      name: "Testability",
      score: 4,
      evidence: "Pricing calculation and state transitions can be evaluated with pure unit tests.",
      concern: "Time-based charges require mocking system clock.",
      suggestion: "Inject a Clock provider dependency.",
      confidence: 0.87
    }
  ],
  overallSummary: "Strong, scalable object-oriented design demonstrating mature command of decoupling and strategy patterns.",
  strengths: [
    "Clean separation between floor-level allocation and central coordination.",
    "Extensible pricing strategy cleanly decouples business rules from state."
  ],
  improvements: [
    "Partition synchronization locks to prevent gate bottlenecks.",
    "Inject Clock dependency for deterministic testing."
  ]
};

async function testAIServiceIntegration() {
  console.log("=================================================");
  console.log("🧪 LLD Platform: AI Service Integration Test");
  console.log("=================================================\n");

  let mongoServer;
  let server;
  let baseUrl;

  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connectDB(mongoUri);

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    await seedProblems(mongoUri);
    const problemsRes = await fetch(`${baseUrl}/api/problems`);
    const problemsJson = await problemsRes.json();
    const problemId = problemsJson.data[0]._id;

    // Create attempt
    const attRes = await fetch(`${baseUrl}/api/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId })
    });
    const attJson = await attRes.json();
    const attemptId = attJson.data._id;

    // Submit solution using AIEvaluator
    const mockClient = new MockLLMClient(sampleAIResponse);
    const customAIEvaluator = new AIEvaluator(mockClient);

    const aiEvalService = new EvaluationService(
      evaluationRepository,
      submissionRepository,
      attemptRepository,
      problemRepository,
      customAIEvaluator
    );

    // Create submission record
    const sub = await submissionRepository.create({
      attemptId,
      type: "TEXT",
      content: {
        assumptions: "Multi-floor lot with automated gates",
        coreClasses: "ParkingLot, ParkingFloor, ParkingSpot",
        responsibilities: "ParkingLot coordinates; ParkingFloor manages spots",
        relationships: "ParkingLot has floors",
        designPatterns: "Strategy pattern for fee calculation",
        edgeCases: "Lot full, simultaneous arrivals",
        explanation: "Decoupled architecture"
      },
      submittedAt: new Date()
    });

    // Run AI evaluation via EvaluationService
    console.log("⏳ Running AI evaluation through EvaluationService...");
    const evalResult = await aiEvalService.evaluateSubmission(sub._id);

    console.assert(evalResult.status === "COMPLETED", "Status should be COMPLETED");
    console.assert(evalResult.evaluatorType === "AI", `Expected evaluatorType AI, got ${evalResult.evaluatorType}`);
    console.assert(evalResult.criteria.length === 6, "Expected 6 criteria");
    console.assert(evalResult.criteria[0].score === 5, "Score mismatch");
    console.log(`✓ 1. Evaluation completed via AIEvaluator with evaluatorType: "${evalResult.evaluatorType}"`);

    // Verify Attempt updated to COMPLETED
    const updatedAtt = await attemptRepository.findById(attemptId);
    console.assert(updatedAtt.status === "COMPLETED", "Attempt should be COMPLETED");
    console.log(`✓ 2. Attempt transitioned to "${updatedAtt.status}"`);

    // Verify GET /api/evaluations/:submissionId API
    const apiEvalRes = await fetch(`${baseUrl}/api/evaluations/${sub._id}`);
    const apiEvalJson = await apiEvalRes.json();
    console.assert(apiEvalJson.data.evaluatorType === "AI", "API must return evaluatorType: AI");
    console.assert(apiEvalJson.data.criteria.length === 6, "API must return 6 criteria");
    console.log(`✓ 3. GET /api/evaluations/:submissionId verified with evaluatorType: "${apiEvalJson.data.evaluatorType}"`);

    // Test AI Failure Handling: Ensure NO silent fallback
    console.log("\n⏳ Testing AI failure handling without silent fallback...");
    const failingMockClient = new MockLLMClient(new Error("Simulated LLM rate limit (429)"));
    const failingAIEval = new AIEvaluator(failingMockClient);
    const failingAIService = new EvaluationService(
      evaluationRepository,
      submissionRepository,
      attemptRepository,
      problemRepository,
      failingAIEval
    );

    // Create another attempt
    const attFailRes = await fetch(`${baseUrl}/api/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId })
    });
    const attFailJson = await attFailRes.json();
    const failAttemptId = attFailJson.data._id;

    const failSub = await submissionRepository.create({
      attemptId: failAttemptId,
      type: "TEXT",
      content: { assumptions: "test", coreClasses: "test", explanation: "test" },
      submittedAt: new Date()
    });

    try {
      await failingAIService.evaluateSubmission(failSub._id);
      console.assert(false, "Should have thrown AI failure");
    } catch {
      // Expected failure
    }

    const failedEvalRecord = await evaluationRepository.findBySubmissionId(failSub._id);
    const failedAttRecord = await attemptRepository.findById(failAttemptId);
    console.assert(failedEvalRecord.status === "FAILED", `Expected FAILED evaluation, got ${failedEvalRecord.status}`);
    console.assert(failedEvalRecord.evaluatorType === "AI", `evaluatorType must be AI, got ${failedEvalRecord.evaluatorType}`);
    console.assert(failedAttRecord.status === "FAILED", `Expected FAILED attempt, got ${failedAttRecord.status}`);
    console.log("✓ 4. AI failure persisted as FAILED with evaluatorType: AI (No silent fallback to RuleEvaluator).");

    console.log("\n=================================================");
    console.log("🎉 ALL AI SERVICE INTEGRATION TESTS PASSED!");
    console.log("=================================================\n");
  } finally {
    if (server) server.close();
    await disconnectDB();
    if (mongoServer) await mongoServer.stop();
  }
}

testAIServiceIntegration().catch((err) => {
  console.error("❌ AI Service Integration test failed:", err);
  process.exit(1);
});
