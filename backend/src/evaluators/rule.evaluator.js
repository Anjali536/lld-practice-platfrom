import { EvaluationStrategy } from "./evaluation.strategy.js";

/**
 * Deterministic Rule-Based Evaluator for LLD submissions.
 * Analyzes structured architectural sections against core OOP principles and problem requirements.
 */
export class RuleEvaluator extends EvaluationStrategy {
  async evaluate(submission, problem) {
    const content = submission.content || {};
    const problemTitle = problem?.title || "System Design";

    const assumptions = (content.assumptions || "").trim();
    const coreClasses = (content.coreClasses || "").trim();
    const responsibilities = (content.responsibilities || "").trim();
    const relationships = (content.relationships || "").trim();
    const designPatterns = (content.designPatterns || "").trim();
    const edgeCases = (content.edgeCases || "").trim();
    const explanation = (content.explanation || "").trim();

    // Heuristics
    const hasMultipleClasses = coreClasses.split(/[\n,;]/).filter((s) => s.trim().length > 0).length >= 3;
    const mentionsInterfaces = /interface|abstract|polymorphism|implements|extends|hierarchy/i.test(
      coreClasses + relationships + designPatterns
    );
    const mentionsPatterns = /strategy|factory|observer|state|singleton|command|decorator|adapter/i.test(
      designPatterns + explanation
    );
    const mentionsDecoupling = /decouple|separation|dependency injection|inject|inversion|loose|cohesion/i.test(
      responsibilities + relationships + explanation
    );
    const mentionsTesting = /test|mock|stub|unit|isolated|deterministic|pure/i.test(
      explanation + responsibilities + edgeCases
    );
    const mentionsConcurrency = /concurren|thread|lock|atomic|race|mutex|sync/i.test(
      assumptions + edgeCases + explanation
    );

    // 1. Requirement Understanding
    const reqUnderstandingScore = assumptions.length > 30 && coreClasses.length > 40 ? 4 : 3;
    const reqEvidence = assumptions.length > 30
      ? `Identified operational boundaries: "${assumptions.slice(0, 90)}..."`
      : "Basic assumptions captured without deep operational parameters.";
    const reqConcern = !mentionsConcurrency
      ? "Concurrency limits and multi-terminal access were not explicitly quantified."
      : "Clarify throughput thresholds under peak load bursts.";
    const reqSuggestion = "Document quantitative limits (e.g. peak requests per second, maximum retry windows).";

    // 2. Responsibilities
    const respScore = hasMultipleClasses && responsibilities.length > 50 ? 4 : 3;
    const respEvidence = responsibilities.length > 40
      ? `Responsibilities allocated across defined entities: "${responsibilities.slice(0, 90)}..."`
      : "High-level component roles mentioned.";
    const respConcern = !mentionsDecoupling
      ? "Core controller may concentrate orchestration and domain computation together."
      : "Ensure domain models do not leak persistence or transport concerns.";
    const respSuggestion = "Segregate calculation and state manipulation behind specialized service/handler classes.";

    // 3. Encapsulation & Abstraction
    const encapScore = mentionsInterfaces ? 4 : 3;
    const encapEvidence = mentionsInterfaces
      ? "Employs abstraction hierarchies or polymorphic boundaries across domain objects."
      : "Concrete representations used for entities.";
    const encapConcern = !mentionsInterfaces
      ? "Relying purely on concrete classes makes substituting implementations rigid."
      : "Ensure internal collections are exposed only via unmodifiable views.";
    const encapSuggestion = "Introduce interfaces for pluggable subsystems (e.g., pricing schemes, notification channels).";

    // 4. Coupling & Cohesion
    const couplingScore = mentionsDecoupling ? 4 : 3;
    const couplingEvidence = mentionsDecoupling
      ? "Explicit intention to keep subsystems loosely coupled with targeted boundaries."
      : "Direct references exist between coordinating classes.";
    const couplingConcern = "Direct instantiation within caller classes creates tight compile-time coupling.";
    const couplingSuggestion = "Inject dependencies through constructors rather than instantiating internally.";

    // 5. Extensibility
    const extScore = mentionsPatterns ? (designPatterns.length > 40 ? 5 : 4) : 3;
    const extEvidence = mentionsPatterns
      ? `Incorporates design patterns suitable for extending behavior: "${designPatterns.slice(0, 80)}..."`
      : "Standard object decomposition without specialized behavioral patterns.";
    const extConcern = !mentionsPatterns
      ? "Adding new rules or behaviors will require modifying existing class methods (violating Open/Closed)."
      : "Avoid over-engineering patterns where simple composition suffices.";
    const extSuggestion = "Use Strategy or State pattern to allow adding new behaviors without touching orchestrators.";

    // 6. Testability
    const testScore = mentionsTesting ? 4 : 3;
    const testEvidence = mentionsTesting
      ? "Isolated functions and stateless calculation helpers support direct unit testing."
      : "Architecture can be tested at the integration level.";
    const testConcern = "Tightly bound singletons or system clock calls hinder deterministic unit tests.";
    const testSuggestion = "Pass external clocks, random generators, and hardware interfaces as mockable dependencies.";

    const criteria = [
      {
        name: "Requirement Understanding",
        score: reqUnderstandingScore,
        evidence: reqEvidence,
        concern: reqConcern,
        suggestion: reqSuggestion,
        confidence: 0.92
      },
      {
        name: "Responsibilities",
        score: respScore,
        evidence: respEvidence,
        concern: respConcern,
        suggestion: respSuggestion,
        confidence: 0.88
      },
      {
        name: "Encapsulation & Abstraction",
        score: encapScore,
        evidence: encapEvidence,
        concern: encapConcern,
        suggestion: encapSuggestion,
        confidence: 0.85
      },
      {
        name: "Coupling & Cohesion",
        score: couplingScore,
        evidence: couplingEvidence,
        concern: couplingConcern,
        suggestion: couplingSuggestion,
        confidence: 0.84
      },
      {
        name: "Extensibility",
        score: extScore,
        evidence: extEvidence,
        concern: extConcern,
        suggestion: extSuggestion,
        confidence: 0.90
      },
      {
        name: "Testability",
        score: testScore,
        evidence: testEvidence,
        concern: testConcern,
        suggestion: testSuggestion,
        confidence: 0.86
      }
    ];

    const strengths = [
      `Clean entity breakdown tailored for ${problemTitle}.`,
      mentionsPatterns
        ? "Thoughtful application of standard design patterns to decouple runtime variations."
        : "Direct, scannable domain class structure.",
      "Clear articulation of edge cases and functional boundaries."
    ];

    const improvements = [
      !mentionsConcurrency
        ? "Explicitly account for concurrent thread access and atomic reservations."
        : "Clarify recovery mechanisms when hardware or downstream operations fail.",
      "Isolate policy/calculation algorithms behind dedicated interfaces to adhere to Single Responsibility.",
      "Consider dependency inversion to simplify parallel test harnesses."
    ];

    const overallSummary =
      `Well-organized object-oriented design for the ${problemTitle}. ` +
      `The solution clearly isolates the primary domain entities and formulates rational interactions. ` +
      `Focusing on loose coupling through dependency injection and explicit strategy interfaces will elevate robustness.`;

    return {
      evaluatorType: "RULE",
      criteria,
      overallSummary,
      strengths,
      improvements
    };
  }
}

export const ruleEvaluator = new RuleEvaluator();
