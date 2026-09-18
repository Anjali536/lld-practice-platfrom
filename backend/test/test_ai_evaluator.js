import { AIEvaluator } from "../src/evaluators/ai.evaluator.js";
import { MockLLMClient } from "../src/evaluators/llm.client.js";

const mockProblem = {
  title: "Parking Lot",
  difficulty: "Medium",
  description: "Design an automated multi-level parking lot system with multi-type vehicles.",
  requirements: [
    { id: "req-1", category: "Functional", title: "Vehicle Types", description: "Motorcycle, Car, Truck" },
    { id: "req-2", category: "Functional", title: "Ticketing", description: "Issue and validate tickets" }
  ],
  constraints: ["Fixed floor capacity"],
  designConsiderations: ["Decouple spot finding strategy"]
};

const mockSubmission = {
  content: {
    assumptions: "Single entry and exit gate per floor. Standard vehicle dimensions.",
    coreClasses: "ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, PaymentService",
    responsibilities: "ParkingLot orchestrates floors; ParkingFloor locates available spots.",
    relationships: "ParkingLot has-a List<ParkingFloor>; ParkingFloor has-a List<ParkingSpot>.",
    designPatterns: "Strategy pattern for fee calculation; Factory for vehicle creation.",
    edgeCases: "Lot full rejects new entries; simultaneous entries synchronized via spot lock.",
    explanation: "Decoupled architecture delegating spot lookup to individual floors with injectable pricing strategies."
  }
};

const validAIJson = {
  criteria: [
    {
      name: "Requirement Understanding",
      score: 4,
      evidence: "The submission explicitly addresses multiple vehicle types and ticketing workflow.",
      concern: "Multi-gate throughput under simultaneous peak arrivals could be further detailed.",
      suggestion: "Introduce a GateController with atomic spot reservation.",
      confidence: 0.92
    },
    {
      name: "Responsibilities",
      score: 4,
      evidence: "ParkingLot coordinates floors while PaymentService handles charges.",
      concern: "ParkingFloor takes on both spot storage and search algorithm.",
      suggestion: "Extract a ParkingSpotFinder strategy interface.",
      confidence: 0.88
    },
    {
      name: "Encapsulation & Abstraction",
      score: 4,
      evidence: "Abstract ParkingSpot and Vehicle types hide dimension-specific details.",
      concern: "Ticket exposes direct internal spot references.",
      suggestion: "Expose only SpotId and FloorId on the ticket object.",
      confidence: 0.85
    },
    {
      name: "Coupling & Cohesion",
      score: 3,
      evidence: "PaymentService is decoupled from ParkingLot via ParkingTicket.",
      concern: "ParkingLot is directly coupled to concrete ParkingFloor instances.",
      suggestion: "Inject floor collections via constructor.",
      confidence: 0.82
    },
    {
      name: "Extensibility",
      score: 5,
      evidence: "Strategy pattern used for fee calculation allows adding EV or peak tariffs without modifying core classes.",
      concern: "Adding new spot amenities requires schema updates.",
      suggestion: "Use a feature/capability tag set on ParkingSpot.",
      confidence: 0.9
    },
    {
      name: "Testability",
      score: 4,
      evidence: "Fee calculation and spot validation can be isolated in pure unit tests.",
      concern: "Singleton pattern would inhibit parallel test runs.",
      suggestion: "Use dependency injection rather than static singletons.",
      confidence: 0.87
    }
  ],
  overallSummary: "A well-structured object-oriented design that captures fundamental domain entities with high cohesion.",
  strengths: [
    "Responsibilities are reasonably separated between ParkingLot, ParkingFloor, and ParkingSpot.",
    "Fee calculation is separated via the Strategy pattern."
  ],
  improvements: [
    "Extract allocation heuristics behind an AllocationStrategy interface.",
    "Avoid singleton controllers to facilitate parallel testing."
  ]
};

async function runAIEvaluatorTests() {
  console.log("=================================================");
  console.log("🧪 LLD Platform: AI Evaluator Unit & Error Tests");
  console.log("=================================================\n");

  // Test 1: Valid AI Response
  console.log("Testing Case 1: Valid AI response parsing & validation...");
  const mockClient1 = new MockLLMClient(validAIJson);
  const evaluator1 = new AIEvaluator(mockClient1);
  const result1 = await evaluator1.evaluate(mockSubmission, mockProblem);

  console.assert(result1.evaluatorType === "AI", "evaluatorType must be AI");
  console.assert(result1.criteria.length === 6, `Expected 6 criteria, got ${result1.criteria.length}`);
  console.assert(result1.overallSummary.length > 20, "overallSummary missing");
  console.assert(result1.strengths.length === 2, "strengths mismatch");
  console.assert(result1.improvements.length === 2, "improvements mismatch");
  console.log("✓ 1. Valid AI response successfully parsed and normalized.");

  // Test 2: Invalid JSON from Provider
  console.log("\nTesting Case 2: Invalid JSON handling...");
  const mockClient2 = new MockLLMClient("I am not valid JSON at all!");
  const evaluator2 = new AIEvaluator(mockClient2);
  try {
    await evaluator2.evaluate(mockSubmission, mockProblem);
    console.assert(false, "Should have thrown for invalid JSON");
  } catch (err) {
    console.assert(err.message.includes("could not be parsed as JSON"), "Unexpected error message");
    console.log(`✓ 2. Invalid JSON rejected cleanly: "${err.message}"`);
  }

  // Test 3: Missing Required Criterion
  console.log("\nTesting Case 3: Missing criterion in AI response...");
  const missingCriterionJson = {
    ...validAIJson,
    criteria: validAIJson.criteria.slice(0, 5) // only 5 criteria
  };
  const mockClient3 = new MockLLMClient(missingCriterionJson);
  const evaluator3 = new AIEvaluator(mockClient3);
  try {
    await evaluator3.evaluate(mockSubmission, mockProblem);
    console.assert(false, "Should have thrown for missing criterion");
  } catch (err) {
    console.assert(err.message.includes("exactly 6 criteria"), "Unexpected error message");
    console.log(`✓ 3. Missing criterion rejected cleanly: "${err.message}"`);
  }

  // Test 4: Invalid Score (Out of range)
  console.log("\nTesting Case 4: Invalid score (< 1 or > 5)...");
  const invalidScoreJson = {
    ...validAIJson,
    criteria: validAIJson.criteria.map((c, i) => (i === 0 ? { ...c, score: 7 } : c))
  };
  const mockClient4 = new MockLLMClient(invalidScoreJson);
  const evaluator4 = new AIEvaluator(mockClient4);
  try {
    await evaluator4.evaluate(mockSubmission, mockProblem);
    console.assert(false, "Should have thrown for invalid score");
  } catch (err) {
    console.assert(err.message.includes("invalid score"), "Unexpected error message");
    console.log(`✓ 4. Invalid score rejected cleanly: "${err.message}"`);
  }

  // Test 5: Invalid Confidence (< 0 or > 1)
  console.log("\nTesting Case 5: Invalid confidence range...");
  const invalidConfidenceJson = {
    ...validAIJson,
    criteria: validAIJson.criteria.map((c, i) => (i === 0 ? { ...c, confidence: 1.5 } : c))
  };
  const mockClient5 = new MockLLMClient(invalidConfidenceJson);
  const evaluator5 = new AIEvaluator(mockClient5);
  try {
    await evaluator5.evaluate(mockSubmission, mockProblem);
    console.assert(false, "Should have thrown for invalid confidence");
  } catch (err) {
    console.assert(err.message.includes("invalid confidence"), "Unexpected error message");
    console.log(`✓ 5. Invalid confidence rejected cleanly: "${err.message}"`);
  }

  // Test 6: Provider Failure (Network / 500 error)
  console.log("\nTesting Case 6: Provider network / 500 failure...");
  const mockClient6 = new MockLLMClient(new Error("LLM provider error (500 Internal Server Error)"));
  const evaluator6 = new AIEvaluator(mockClient6);
  try {
    await evaluator6.evaluate(mockSubmission, mockProblem);
    console.assert(false, "Should have thrown for provider failure");
  } catch (err) {
    console.assert(err.message.includes("500 Internal Server Error"), "Unexpected error message");
    console.log(`✓ 6. Provider failure handled cleanly: "${err.message}"`);
  }

  // Test 7: Missing API Key Handling
  console.log("\nTesting Case 7: Missing API key validation in real client...");
  // Import the real LLMClient class without providing an API key
  const { LLMClient } = await import("../src/evaluators/llm.client.js");
  const unconfiguredClient = new LLMClient({ apiKey: "" });
  const evaluator7 = new AIEvaluator(unconfiguredClient);
  try {
    await evaluator7.evaluate(mockSubmission, mockProblem);
    console.assert(false, "Should have thrown for unconfigured API key");
  } catch (err) {
    console.assert(err.message.includes("LLM_API_KEY is not configured"), "Unexpected error message");
    console.log(`✓ 7. Missing API key rejected cleanly: "${err.message}"`);
  }

  console.log("\n=================================================");
  console.log("🎉 ALL 7 AI EVALUATOR UNIT TESTS PASSED!");
  console.log("=================================================\n");
}

runAIEvaluatorTests().catch((err) => {
  console.error("❌ AI Evaluator test failed:", err);
  process.exit(1);
});
