/**
 * Mock Data for LLD Practice Platform
 * Structured cleanly to mirror future backend responses.
 */

export const INITIAL_PROBLEMS = [
  {
    id: "parking-lot",
    title: "Parking Lot",
    difficulty: "Medium",
    shortDescription:
      "Design a parking lot system that supports different vehicle types, parking spots, vehicle allocation, and fee calculation.",
    fullDescription:
      "A multi-level parking lot needs an automated management system. The system must assign available spots suitable for various vehicle dimensions, track check-in and check-out timestamps, apply tiered or hourly pricing models, and handle concurrent entrance/exit terminals.",
    requirementsCount: 7,
    requirements: [
      {
        id: "req-1",
        category: "Functional",
        title: "Multi-type Vehicle Support",
        description: "Must support Motorcycles, Cars, and Large Vehicles (e.g., Buses, Trucks) with tailored spot sizes."
      },
      {
        id: "req-2",
        category: "Functional",
        title: "Spot Allocation Strategy",
        description: "Automatically find and assign the nearest or optimal available parking spot upon vehicle arrival."
      },
      {
        id: "req-3",
        category: "Functional",
        title: "Ticket Generation & Validation",
        description: "Issue a timestamped ticket at entry gates and validate ticket status before permitting vehicle exit."
      },
      {
        id: "req-4",
        category: "Functional",
        title: "Dynamic Fee Calculation",
        description: "Calculate parking fees based on vehicle type, parking duration, and configurable pricing strategies (flat, hourly, peak hours)."
      },
      {
        id: "req-5",
        category: "Functional",
        title: "Multiple Floors and Entry/Exit Points",
        description: "Support multiple levels with independent entry and exit gates operating simultaneously."
      },
      {
        id: "req-6",
        category: "Non-Functional",
        title: "Concurrency & Thread Safety",
        description: "Prevent race conditions where two vehicles are allocated the exact same parking spot simultaneously."
      },
      {
        id: "req-7",
        category: "Non-Functional",
        title: "Extensible Pricing & Allocation Rules",
        description: "New spot allocation algorithms (e.g., EV charging priority) and payment gateways should be pluggable without breaking core classes."
      }
    ],
    constraints: [
      "The parking lot has a fixed capacity across N floors.",
      "A vehicle cannot occupy a spot smaller than its type (e.g., Car cannot fit into Motorcycle spot; a Bus cannot fit in a Car spot).",
      "Spots once vacated must instantly be marked available for new allocations.",
      "The system must operate smoothly in memory for thousands of concurrent transactions."
    ],
    considerations: [
      "How will you decouple spot finding strategies (nearest vs lowest floor) from the main ParkingLot entity?",
      "Which class is responsible for calculating parking fees? Should ParkingLot know about payment details?",
      "How do you represent spots of different sizes? Inheritance vs composition or Enum?",
      "How will you handle edge cases like a lost ticket, overstay, or lot full status?"
    ]
  },
  {
    id: "vending-machine",
    title: "Vending Machine",
    difficulty: "Medium",
    shortDescription:
      "Design a vending machine that manages products, inventory, payments, and product dispensing.",
    fullDescription:
      "Design the control software for an automated retail vending machine. The system guides users through product selection, manages inventory count, accepts multiple payment forms (cash, card, digital wallet), safely dispenses items, returns change, and transitions gracefully between operational states.",
    requirementsCount: 6,
    requirements: [
      {
        id: "req-1",
        category: "Functional",
        title: "State-Driven Workflow",
        description: "Transition through Idle, Item Selection, Awaiting Payment, Dispensing, and Dispensing Change states."
      },
      {
        id: "req-2",
        category: "Functional",
        title: "Inventory Tracking",
        description: "Maintain accurate counts per shelf/rack; reject selection if out of stock."
      },
      {
        id: "req-3",
        category: "Functional",
        title: "Flexible Payment Handling",
        description: "Accept cash denominations, validate sum, and provide hooks for cashless/card payments."
      },
      {
        id: "req-4",
        category: "Functional",
        title: "Safe Dispensing & Change Return",
        description: "Dispense product only after full payment; calculate and return minimum coin change."
      },
      {
        id: "req-5",
        category: "Functional",
        title: "Transaction Cancellation",
        description: "Allow buyer to cancel before dispensing and refund any inserted currency completely."
      },
      {
        id: "req-6",
        category: "Non-Functional",
        title: "Maintainability & Modularity",
        description: "New payment modes (e.g., UPI/NFC) or maintenance modes shouldn't require rewrites of the core state machine."
      }
    ],
    constraints: [
      "The machine has physical limits on cash holding (coins/notes inventory).",
      "If the machine cannot provide exact change, it must warn the user before accepting cash or cancel.",
      "State transitions must be deterministic and prevent invalid operations (e.g., dispensing before paying)."
    ],
    considerations: [
      "State Pattern is typically ideal: how will each State handle inputs like selectItem, insertCash, cancel, dispense?",
      "How do you separate cash storage/change computation from high-level machine coordination?",
      "What happens if dispensing physically jams or fails halfway?",
      "How do you prevent race conditions between simultaneous button presses or sensors?"
    ]
  },
  {
    id: "elevator-system",
    title: "Elevator System",
    difficulty: "Hard",
    shortDescription:
      "Design an elevator system that handles requests, elevator movement, scheduling, and multiple elevators.",
    fullDescription:
      "A high-rise commercial skyscraper requires an intelligent multi-elevator supervisory controller. The system processes internal cabin button presses and external hall call buttons, dispatches optimal cars using scheduling algorithms (e.g., SCAN/LOOK algorithm), tracks floor directions, and handles peak-hour load patterns.",
    requirementsCount: 8,
    requirements: [
      {
        id: "req-1",
        category: "Functional",
        title: "Multi-Car Coordination",
        description: "Manage a bank of N elevators across M floors efficiently."
      },
      {
        id: "req-2",
        category: "Functional",
        title: "Request Processing (Internal & External)",
        description: "Accept external hall calls (floor + desired direction: UP/DOWN) and internal destination requests."
      },
      {
        id: "req-3",
        category: "Functional",
        title: "Dispatch & Scheduling Algorithm",
        description: "Assign hall calls to the most suitable car to minimize average waiting time and power consumption."
      },
      {
        id: "req-4",
        category: "Functional",
        title: "Car State Lifecycle",
        description: "Each elevator transitions across Idle, Moving Up, Moving Down, Doors Opening, Doors Closed, and Maintenance."
      },
      {
        id: "req-5",
        category: "Functional",
        title: "Safety & Overload Sensors",
        description: "Detect maximum weight limits, emergency stops, and door obstruction safety interlocks."
      },
      {
        id: "req-6",
        category: "Non-Functional",
        title: "Extensible Dispatcher",
        description: "Pluggable dispatching algorithms (First-Come First-Served, SCAN, SSTF, Destination Dispatch)."
      },
      {
        id: "req-7",
        category: "Non-Functional",
        title: "Concurrency & Event-Driven Realism",
        description: "Elevators operate independently and concurrently; the dispatcher should handle async events cleanly."
      },
      {
        id: "req-8",
        category: "Non-Functional",
        title: "Fault Tolerance",
        description: "If one elevator undergoes maintenance or faults, other cars seamlessly absorb pending hall calls."
      }
    ],
    constraints: [
      "Car capacities and maximum speeds are fixed per car.",
      "An elevator moving UP will service all intermediate UP calls before reversing to handle DOWN calls.",
      "Doors must never open while moving between floors."
    ],
    considerations: [
      "Dispatcher vs Elevator Car: How are requests routed and queued? Does each car have its own request queues?",
      "Which design patterns fit best? (Strategy pattern for scheduling, Observer/Pub-Sub for car status updates, State pattern for door/motor lifecycle).",
      "How do you separate hardware controller interfaces from the domain logic?",
      "How do you handle emergency fire mode or power backup states?"
    ]
  }
];

/**
 * Pre-seeded mock attempts to showcase history if needed,
 * plus mock feedback generators tailored to each problem.
 */
export const INITIAL_ATTEMPTS = [
  {
    id: "att-sample-1",
    problemId: "parking-lot",
    problemTitle: "Parking Lot",
    attemptNumber: 1,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    submissionId: "sub-sample-1",
    summaryScores: {
      responsibilities: 4,
      extensibility: 3,
      overall: "3.8/5"
    },
    solution: {
      assumptions: "Single entry and single exit per floor. Standard vehicles only (Bike, Car, Truck). Cashless credit payments only.",
      coreClasses: "ParkingLot (singleton controller)\nParkingFloor (contains list of spots)\nParkingSpot (abstract, with CompactSpot, LargeSpot, HandicappedSpot)\nVehicle (abstract, Car, Bike, Truck)\nParkingTicket (holds entryTime, spotId, vehicleId)\nPaymentService (calculates amount)",
      responsibilities: "ParkingLot coordinates floors and dispatches tickets.\nParkingFloor finds free spot.\nPaymentService computes charges based on ticket duration.\nParkingSpot tracks occupied state.",
      relationships: "ParkingLot has-a List<ParkingFloor>\nParkingFloor has-a List<ParkingSpot>\nParkingTicket associates Vehicle with ParkingSpot\nPaymentService depends on ParkingTicket",
      designPatterns: "Singleton for ParkingLot controller.\nFactory Method for Vehicle and ParkingSpot instantiation.\nStrategy Pattern for FeeCalculationStrategy.",
      edgeCases: "Lot full rejects entry immediately.\nLost ticket charges daily max rate.\nSimultaneous entries handled via synchronized spot assignment lock.",
      explanation: "Designed around a central controller that delegates spot queries to individual floors. Decoupled fee calculation using Strategy pattern to allow holiday/peak surges."
    }
  }
];

export const INITIAL_SUBMISSIONS = {
  "sub-sample-1": {
    submissionId: "sub-sample-1",
    attemptId: "att-sample-1",
    problemId: "parking-lot",
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    overallSummary:
      "A well-structured object-oriented design that captures the fundamental entities cleanly. Good separation between floor management and ticket issuing. Some coupling remains between the ParkingLot singleton and spot allocation algorithms.",
    strengths: [
      "Responsibilities are reasonably separated between ParkingLot, ParkingFloor, and ParkingSpot.",
      "Vehicle-specific behaviour and parking spot tiers are cleanly abstracted using polymorphism.",
      "Fee calculation is separated via the Strategy pattern, allowing easy extensibility."
    ],
    improvements: [
      "ParkingLot singleton can become a bottleneck under heavy concurrent multi-gate traffic.",
      "Spot allocation logic is nested in ParkingFloor instead of an injectable AllocationStrategy.",
      "Handling of concurrent gate check-ins needs clearer synchronization or thread-safe spot reservations."
    ],
    criteria: [
      {
        name: "Requirement Understanding",
        score: 4,
        evidence: "Covered all multi-type vehicle support, ticketing lifecycle, and floor management.",
        concern: "Did not detail multi-gate entrance concurrency thoroughly.",
        suggestion: "Specify how multiple entrance gates check available spots without colliding.",
        confidence: 0.92
      },
      {
        name: "Responsibilities",
        score: 4,
        evidence: "ParkingLot coordinates, ParkingFloor maintains spots, PaymentService handles charges.",
        concern: "ParkingFloor takes on both spot storage and search algorithm.",
        suggestion: "Extract a ParkingSpotFinder or AllocationStrategy interface from ParkingFloor.",
        confidence: 0.88
      },
      {
        name: "Encapsulation & Abstraction",
        score: 4,
        evidence: "Abstract ParkingSpot and Vehicle types hide dimension-specific details.",
        concern: "Ticket exposes direct spot internal reference.",
        suggestion: "Expose only SpotId and FloorId on the ticket object rather than mutating spot directly.",
        confidence: 0.85
      },
      {
        name: "Coupling & Cohesion",
        score: 3,
        evidence: "PaymentService is decoupled from ParkingLot via ParkingTicket.",
        concern: "ParkingLot is tightly coupled to concrete ParkingFloor implementations.",
        suggestion: "Use dependency injection or an interface for floor management to simplify unit testing.",
        confidence: 0.82
      },
      {
        name: "Extensibility",
        score: 4,
        evidence: "Strategy pattern used for fee calculation allows adding EV surge or weekend tariffs.",
        concern: "Adding dynamic dynamic spot types requires updating Spot enum and subclasses.",
        suggestion: "Consider feature flags or dimension-based capability tags (e.g., hasElectricCharger).",
        confidence: 0.9
      },
      {
        name: "Testability",
        score: 3,
        evidence: "Pure calculation methods in PaymentService are easily unit-testable.",
        concern: "Singleton ParkingLot makes isolated parallel testing cumbersome.",
        suggestion: "Avoid global static singleton; inject instance into gates and controllers.",
        confidence: 0.86
      }
    ]
  }
};

/**
 * Generates an explainable evaluation based on learner's input and problem context.
 */
export function generateMockEvaluation(problemId, solutionData, submissionId, attemptId) {
  const problem = INITIAL_PROBLEMS.find((p) => p.id === problemId) || INITIAL_PROBLEMS[0];

  // Derive dynamic feedback based on submitted content richness
  const classesLen = (solutionData.coreClasses || "").length;
  const patternsLen = (solutionData.designPatterns || "").length;
  const edgesLen = (solutionData.edgeCases || "").length;

  const respScore = classesLen > 60 ? 4 : 3;
  const extScore = patternsLen > 40 ? 4 : 3;
  const edgeScore = edgesLen > 40 ? 4 : 2;

  if (problemId === "vending-machine") {
    return {
      submissionId,
      attemptId,
      problemId,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      overallSummary:
        "Solid state-oriented approach to modeling the vending machine lifecycle. The solution clearly identifies the core entities (Inventory, CoinRack, State) and addresses the user transaction boundary properly.",
      strengths: [
        "State machine approach provides clean, deterministic transitions between selecting and dispensing.",
        "Cash handling and inventory management are isolated into dedicated subcomponents.",
        "Edge case of transaction cancellation and coin return is explicitly accounted for."
      ],
      improvements: [
        "Change calculation logic should be separated from payment validation to handle insufficient coin inventory.",
        "Ensure state objects don't directly manipulate hardware interfaces without an abstraction layer.",
        "Include handling for power failure or physical item drop sensor failure."
      ],
      criteria: [
        {
          name: "Requirement Understanding",
          score: 4,
          evidence: "Addressed item selection, coin insertion, dispensing, and change return.",
          concern: "Change dispensing edge case when coin inventory is exhausted was not fully elaborated.",
          suggestion: "Add a ChangeDispenser strategy with greedy or dynamic coin payout fallback.",
          confidence: 0.91
        },
        {
          name: "Responsibilities",
          score: respScore,
          evidence: "Separate components for State, Inventory, and CashManager.",
          concern: "VendingMachine context class occasionally coordinates low-level coin counting.",
          suggestion: "Delegate all money tallying and change computations to an explicit CashRegister module.",
          confidence: 0.87
        },
        {
          name: "Encapsulation & Abstraction",
          score: 4,
          evidence: "Machine states encapsulate allowed actions and reject invalid calls gracefully.",
          concern: "Inventory item pricing details exposed directly to machine context.",
          suggestion: "Encapsulate Product and ShelfSlot such that stock count mutations occur through transactional methods.",
          confidence: 0.89
        },
        {
          name: "Coupling & Cohesion",
          score: 4,
          evidence: "High cohesion within states (e.g., HasMoneyState only knows about money inputs).",
          concern: "States hold references to the concrete VendingMachine context.",
          suggestion: "Pass a minimal MachineControl interface to states rather than the whole context.",
          confidence: 0.84
        },
        {
          name: "Extensibility",
          score: extScore,
          evidence: "New payment modes (e.g., QR/Card) can be plugged in by defining new PaymentStrategy implementations.",
          concern: "Adding new operational states requires updating the State interface.",
          suggestion: "Keep the state interface lean and use default no-op methods where appropriate.",
          confidence: 0.86
        },
        {
          name: "Testability",
          score: 4,
          evidence: "State classes can be unit-tested in isolation by mocking the context interface.",
          concern: "Testing change-making algorithm with various coin stock combinations needs pure functions.",
          suggestion: "Make ChangeCalculator a pure deterministic function easy to fuzz test.",
          confidence: 0.88
        }
      ]
    };
  } else if (problemId === "elevator-system") {
    return {
      submissionId,
      attemptId,
      problemId,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      overallSummary:
        "Comprehensive design tackling the tricky scheduling and dispatching coordination of multi-car high-rise systems. The separation between external hall dispatchers and internal elevator state machines shows strong low-level system maturity.",
      strengths: [
        "Clear distinction between internal cabin requests and external landing hall requests.",
        "Decoupled scheduling algorithms allow experimenting with SCAN, LOOK, or FCFS strategies.",
        "Safety interlocks (doors, weight overload) are modeled as explicit guard conditions."
      ],
      improvements: [
        "Concurrency handling between real-time floor sensors and scheduling queue needs explicit synchronization.",
        "Fault tolerance: reassigning pending requests when a car goes into maintenance should be clarified.",
        "Consider power/energy optimization metrics in dispatching decision trees."
      ],
      criteria: [
        {
          name: "Requirement Understanding",
          score: 4,
          evidence: "Addresses multiple cars, multi-floor routing, directional requests, and basic safety.",
          concern: "Did not specify how cars communicate status back to the central supervisory controller.",
          suggestion: "Adopt an Observer/Pub-Sub pattern so cars broadcast FloorReached and StateChanged events.",
          confidence: 0.94
        },
        {
          name: "Responsibilities",
          score: respScore,
          evidence: "ElevatorController handles assignment; ElevatorCar manages motion and door cycles.",
          concern: "ElevatorCar may be burdened with too many sensor checks.",
          suggestion: "Break ElevatorCar into MotorController, DoorMechanism, and RequestBuffer.",
          confidence: 0.89
        },
        {
          name: "Encapsulation & Abstraction",
          score: 4,
          evidence: "Scheduling algorithms hidden behind a DispatchStrategy interface.",
          concern: "Internal floor queue representation leaked to the external dispatcher.",
          suggestion: "Expose only capacity, direction, and ETA estimate methods to the dispatcher.",
          confidence: 0.87
        },
        {
          name: "Coupling & Cohesion",
          score: 4,
          evidence: "Dispatcher does not depend on car motor mechanics.",
          concern: "Direct bidirectional reference between Controller and Car can cause memory retention or cyclic dependencies.",
          suggestion: "Invert dependency using an Event Bus or status callback interface.",
          confidence: 0.83
        },
        {
          name: "Extensibility",
          score: extScore,
          evidence: "Dispatch strategy can be easily swapped for peak morning or evening traffic modes.",
          concern: "Hardcoded floor limits could complicate buildings with express or VIP zones.",
          suggestion: "Introduce FloorZone or Bank constraints into the dispatcher.",
          confidence: 0.92
        },
        {
          name: "Testability",
          score: edgeScore > 2 ? 4 : 3,
          evidence: "Deterministic SCAN algorithms can be tested with simulated timestamped request streams.",
          concern: "Time-dependent door timers and movement loops are difficult to test without virtual clocks.",
          suggestion: "Inject a Clock/Scheduler interface so time steps can be simulated instantly in unit tests.",
          confidence: 0.85
        }
      ]
    };
  } else {
    // Default Parking Lot evaluation
    return {
      submissionId,
      attemptId,
      problemId: "parking-lot",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      overallSummary:
        "A cohesive, well-reasoned object-oriented design that captures the primary domain entities. Spot hierarchy, ticket generation, and pricing calculations are properly separated with clear boundaries.",
      strengths: [
        "Clear entity breakdown between ParkingLot, Floors, Spots, and Vehicles.",
        "Separation of concerns between spot reservation and fee computation.",
        "Sensible application of design patterns (Strategy for pricing, Factory for spots/vehicles)."
      ],
      improvements: [
        "Consider multi-gate concurrency to prevent race conditions during high-volume entries.",
        "Decouple spot search strategy so nearest-to-entrance or VIP routing can be injected cleanly.",
        "Clarify transaction rollbacks if a vehicle ticket generation fails after allocating a spot."
      ],
      criteria: [
        {
          name: "Requirement Understanding",
          score: 4,
          evidence: "Covers multi-vehicle categorization, floor tracking, ticketing, and fee computation.",
          concern: "Concurrency safeguards at multi-entry gates were not fully specified.",
          suggestion: "Explain synchronization mechanism or atomic reservation per spot.",
          confidence: 0.92
        },
        {
          name: "Responsibilities",
          score: respScore,
          evidence: "Separate components for parking coordination, spot status, and pricing.",
          concern: "Floor entity handles both physical spot containment and allocation algorithm.",
          suggestion: "Extract an AllocationStrategy interface to isolate spot assignment heuristics.",
          confidence: 0.88
        },
        {
          name: "Encapsulation & Abstraction",
          score: 4,
          evidence: "Vehicle dimensions and spot compatibility abstracted through hierarchies.",
          concern: "Ticket entity exposes mutable internal spot pointer.",
          suggestion: "Use immutable identifiers (SpotId, LevelNumber) in the Ticket instead.",
          confidence: 0.86
        },
        {
          name: "Coupling & Cohesion",
          score: 4,
          evidence: "Pricing strategies decoupled from the central parking lot manager.",
          concern: "ParkingLot coordinator depends on concrete floor instances.",
          suggestion: "Inject floor collections via constructor to facilitate mocking.",
          confidence: 0.84
        },
        {
          name: "Extensibility",
          score: extScore,
          evidence: "Strategy pattern enables adding new fee calculations (e.g. EV charging surcharge).",
          concern: "Adding new spot amenities (e.g., covered vs uncovered) requires schema updates.",
          suggestion: "Use a feature/capability set on ParkingSpot rather than rigid inheritance.",
          confidence: 0.9
        },
        {
          name: "Testability",
          score: 4,
          evidence: "Fee calculation and spot validation can be isolated in pure unit tests.",
          concern: "Static state or singleton pattern would inhibit parallel test runs.",
          suggestion: "Use dependency injection rather than a static singleton for the core manager.",
          confidence: 0.87
        }
      ]
    };
  }
}
