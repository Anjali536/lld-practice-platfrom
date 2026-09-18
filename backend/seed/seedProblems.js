import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { Problem } from "../src/models/problem.model.js";

dotenv.config();

export const SEED_PROBLEMS = [
  {
    title: "Parking Lot",
    difficulty: "Medium",
    description:
      "Design a parking lot system that supports different vehicle types, parking spots, vehicle allocation, and fee calculation. The system manages multi-level spots, issues tickets, and prevents double-allocation.",
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
        description: "Calculate parking fees based on vehicle type, parking duration, and configurable pricing strategies."
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
        description: "New spot allocation algorithms and payment gateways should be pluggable without breaking core classes."
      }
    ],
    constraints: [
      "The parking lot has a fixed capacity across N floors.",
      "A vehicle cannot occupy a spot smaller than its type.",
      "Spots once vacated must instantly be marked available for new allocations.",
      "The system must operate smoothly in memory for thousands of concurrent transactions."
    ],
    designConsiderations: [
      "How will you decouple spot finding strategies from the main ParkingLot entity?",
      "Which class is responsible for calculating parking fees? Should ParkingLot know about payment details?",
      "How do you represent spots of different sizes? Inheritance vs composition or Enum?",
      "How will you handle edge cases like a lost ticket, overstay, or lot full status?"
    ]
  },
  {
    title: "Vending Machine",
    difficulty: "Medium",
    description:
      "Design a vending machine that manages products, inventory, payments, and product dispensing. The machine guides buyers through item selection, cash/card handling, dispensing, and change computation.",
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
      "State transitions must be deterministic and prevent invalid operations."
    ],
    designConsiderations: [
      "State Pattern is typically ideal: how will each State handle inputs like selectItem, insertCash, cancel, dispense?",
      "How do you separate cash storage/change computation from high-level machine coordination?",
      "What happens if dispensing physically jams or fails halfway?",
      "How do you prevent race conditions between simultaneous button presses or sensors?"
    ]
  },
  {
    title: "Elevator System",
    difficulty: "Hard",
    description:
      "Design an elevator system that handles requests, elevator movement, scheduling, and multiple elevators. The controller processes internal cabin and external landing requests using intelligent scheduling algorithms.",
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
        description: "Accept external hall calls (floor + desired direction) and internal destination requests."
      },
      {
        id: "req-3",
        category: "Functional",
        title: "Dispatch & Scheduling Algorithm",
        description: "Assign hall calls to the most suitable car to minimize average waiting time."
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
    designConsiderations: [
      "Dispatcher vs Elevator Car: How are requests routed and queued? Does each car have its own request queues?",
      "Which design patterns fit best? (Strategy pattern for scheduling, Observer/Pub-Sub for car status updates, State pattern for door/motor lifecycle).",
      "How do you separate hardware controller interfaces from the domain logic?",
      "How do you handle emergency fire mode or power backup states?"
    ]
  }
];

export async function seedProblems(customUri) {
  try {
    await connectDB(customUri);

    console.log("[Seed] Checking existing problems in MongoDB...");
    let insertedCount = 0;
    let skippedCount = 0;

    for (const pData of SEED_PROBLEMS) {
      const exists = await Problem.findOne({ title: pData.title });
      if (!exists) {
        await Problem.create(pData);
        console.log(`[Seed] Created problem: "${pData.title}" (${pData.difficulty})`);
        insertedCount++;
      } else {
        console.log(`[Seed] Problem "${pData.title}" already exists. Skipping.`);
        skippedCount++;
      }
    }

    console.log(`[Seed] Completed. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
    return { insertedCount, skippedCount };
  } catch (error) {
    console.error("[Seed] Seeding failed:", error);
    throw error;
  } finally {
    if (!customUri) {
      await disconnectDB();
    }
  }
}

// Run directly if invoked from CLI
if (process.argv[1]?.endsWith("seedProblems.js")) {
  seedProblems()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
