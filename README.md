# LLD Practice Platform

A focused practice platform for learning and improving Low-Level Design (LLD) skills.

The platform follows a simple learning loop:

**Choose a problem → Design → Submit → Get feedback → Review → Retry**

The goal is to provide a small, focused practice experience rather than a large LMS or assessment system.

---

## Features

* Browse LLD practice problems
* View problem requirements and constraints
* Start a practice attempt
* Save design drafts
* Define core classes and responsibilities
* Define relationships between classes
* Mention design patterns
* Document assumptions and edge cases
* Submit an LLD solution
* Track submission/evaluation status
* Receive structured evaluation feedback
* Review previous attempts
* Retry a problem

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Vanilla CSS

### Backend

* Node.js
* Express.js
* Mongoose

### Database

* MongoDB

### Evaluation

* Deterministic rule-based evaluator

The evaluator assesses the submission against six criteria:

1. Requirement Understanding
2. Responsibilities
3. Encapsulation & Abstraction
4. Coupling / Cohesion
5. Extensibility
6. Testability

---

## Project Structure

```text
lld-practice-platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── evaluators/
│   │   ├── middleware/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── seed/
│   ├── test/
│   ├── package.json
│   └── .env
│
├── README.md
└── AI_USAGE.md
```

---

# Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB Atlas account or a MongoDB instance

A recent LTS version of Node.js is recommended.

---

# Setup

## 1. Clone / Open the Project

Open the project root:

```bash
cd lld-practice-platform
```

---

## 2. Configure Backend

Go to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000

MONGODB_URI=mongodb://<username>:<password>@<cluster-host>/<database-name>?<options>

EVALUATION_MODE=rule
```

Replace the MongoDB connection string with your own MongoDB connection string.

For this project, the database name used is:

```text
lld-platform
```

### Important

Do not commit the real MongoDB connection string or database credentials to Git.

---

# 3. Seed the Database

From the `backend` directory:

```bash
npm run seed
```

This populates the database with the initial LLD problems.

The current MVP contains a small set of practice problems such as:

* Parking Lot
* Vending Machine
* Elevator System

The project intentionally keeps the problem set small to stay within the MVP scope.

---

# 4. Start the Backend

From:

```text
lld-practice-platform/backend
```

run:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

The API base path is:

```text
http://localhost:5000/api
```

---

# 5. Configure Frontend

Open another terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create or verify the frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# 6. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, typically:

```text
http://localhost:5173
```

Open that URL in a browser.

---

# Available Routes

| Route                     | Purpose                           |
| ------------------------- | --------------------------------- |
| `/problems`               | Browse LLD problems               |
| `/problems/:id`           | View problem specification        |
| `/practice/:attemptId`    | Work on an LLD attempt            |
| `/submission/:attemptId`  | View submission/evaluation status |
| `/feedback/:submissionId` | View evaluation feedback          |
| `/history`                | View previous attempts            |

The root route `/` redirects to `/problems`.

---

# Application Flow

## 1. Choose a Problem

The learner selects an LLD problem from the Problems page.

## 2. Start Practice

An attempt is created for the selected problem.

## 3. Design

The learner provides information such as:

* Assumptions
* Core Classes
* Responsibilities
* Relationships
* Design Patterns
* Edge Cases
* Explanation

## 4. Save Draft

The learner can save their progress before submitting.

Draft information is persisted so that the learner can continue the attempt later.

## 5. Submit

The learner submits the completed design.

The submission is persisted before evaluation.

## 6. Evaluate

The rule-based evaluator checks the submission against the defined LLD criteria.

The submission moves through the evaluation flow and eventually reaches a completed or failed state.

## 7. Review Feedback

The learner receives structured feedback containing:

* score
* evidence
* concerns
* suggestions
* confidence

for each evaluation criterion.

## 8. Retry

The learner can start another attempt for the same problem and improve their design.

---

# API Overview

### Problems

```http
GET /api/problems
GET /api/problems/:id
```

### Attempts

```http
POST /api/attempts
GET /api/attempts
GET /api/attempts/:id
PATCH /api/attempts/:id/draft
```

### Submissions

```http
POST /api/submissions
GET /api/submissions/:attemptId
```

### Evaluations

```http
GET /api/evaluations/:submissionId
```

---

# Evaluation Design

The evaluation layer uses a strategy-based approach.

Conceptually:

```text
Submission
    ↓
Evaluation Service
    ↓
Evaluation Strategy
    ↓
Rule Evaluator
    ↓
Evaluation
```

The evaluator produces feedback across six criteria:

* Requirement Understanding
* Responsibilities
* Encapsulation & Abstraction
* Coupling / Cohesion
* Extensibility
* Testability

Each criterion provides a score and supporting feedback.

The evaluator does not require a single "correct" class design. The intent is to evaluate whether the submitted design demonstrates the relevant LLD principles.

---

# Key Design Decisions

## 1. Simple Monolith

A modular monolithic backend was chosen because the assignment focuses on the learner experience rather than distributed-system complexity.

## 2. Separation of Layers

The backend separates:

* Routes
* Controllers
* Services
* Repositories
* Models
* Evaluators

This keeps responsibilities clear while avoiding unnecessary infrastructure.

## 3. Persist Before Evaluation

A submission is stored before evaluation starts.

This prevents the learner's submission from being lost if evaluation fails.

## 4. Deterministic Evaluation

The MVP uses a rule-based evaluator instead of requiring an external LLM.

This makes the system:

* predictable
* testable
* explainable
* easy to run locally

## 5. Evaluation Strategy

The evaluator is abstracted behind a strategy interface so that another evaluator, such as an AI-based evaluator or human evaluator, can be introduced later.

## 6. Small Problem Set

The MVP intentionally contains a small number of LLD problems.

The assignment prioritizes a complete learner journey over a large content library.

---

# Error Handling

The backend handles common failure cases such as:

* invalid IDs
* missing resources
* invalid submissions
* duplicate submissions
* draft updates after submission
* evaluation failures

The submission and attempt state can represent evaluation failure so that failures are visible rather than silently ignored.

---

# Testing

Backend tests can be run from the `backend` directory using the project's configured test command.

The test suite covers important flows including:

* health check
* database seeding
* problem retrieval
* attempt creation
* draft saving
* submission validation
* duplicate submission handling
* evaluation
* evaluation failure
* completed attempts
* feedback retrieval

Frontend build verification:

```bash
cd frontend
npm run build
```

---

# Current Limitations

This is an MVP and intentionally does not include:

* Authentication
* Multi-user accounts
* Role-based access
* Redis
* Background job queues
* Microservices
* Advanced analytics
* Large problem libraries
* Full collaborative editing
* Advanced drag-and-drop diagram editor
* Production deployment configuration

The current evaluator is deterministic and therefore has limited ability to understand nuanced design intent compared with a human reviewer or an LLM.

---

# Future Improvements

Possible future extensions include:

* AI-assisted semantic evaluation
* Human evaluation
* Visual class-diagram editing
* More LLD problems
* User accounts and personalized history
* More detailed progress analytics
* Improved evaluator feedback
* Multiple submission formats

The existing evaluator strategy abstraction is intended to make future evaluator implementations easier to add.

---

# Running the Project Quickly

### Terminal 1 — Backend

```bash
cd lld-practice-platform/backend
npm install
npm run seed
npm run dev
```

### Terminal 2 — Frontend

```bash
cd lld-practice-platform/frontend
npm install
npm run dev
```

Then open the frontend URL shown by Vite.

---

# Environment Variables

## Backend

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
EVALUATION_MODE=rule
```

## Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# Scope

The project focuses on one core learner journey:

**Choose → Design → Submit → Evaluate → Review → Retry**

The implementation intentionally prioritizes a complete and explainable practice loop over adding infrastructure or features that are not necessary for the MVP.
