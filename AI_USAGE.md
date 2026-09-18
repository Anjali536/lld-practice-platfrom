# AI Usage

## Overview

AI tools were used during the development of this project primarily as a development assistant for brainstorming, clarification, and reviewing implementation approaches.

The implementation, project structure, technology choices, and final decisions were reviewed and integrated manually.

AI was used to provide suggestions rather than to independently design or implement the complete application.

## How AI Was Used

### 1. Architecture and Project Structure

AI was used to discuss and validate possible approaches for structuring the application.

For example, AI helped suggest a simple modular monolith structure with:

* React + Vite frontend
* Node.js + Express backend
* MongoDB with Mongoose
* Controllers
* Services
* Repositories
* Evaluator/strategy layer

The final architecture was selected based on the assignment requirements and the need to keep the MVP simple.

### 2. UI/UX Suggestions

AI was used to suggest improvements to:

* information hierarchy
* typography
* spacing
* problem specification presentation
* practice workspace organization
* readability of feedback

These were suggestions only. The final UI direction and changes were reviewed and applied to the project based on the intended learner experience.

### 3. LLD Evaluation Approach

AI was used to discuss how an LLD submission could be evaluated without assuming that there is only one correct design.

This led to the use of criteria such as:

* Requirement Understanding
* Responsibilities
* Encapsulation & Abstraction
* Coupling / Cohesion
* Extensibility
* Testability

The current MVP uses a deterministic rule-based evaluator. This keeps evaluation predictable and explainable.

### 4. Debugging and Development Guidance

AI was also used during development for:

* understanding error messages
* identifying possible implementation issues
* suggesting debugging approaches
* reviewing API flow
* validating frontend/backend integration
* suggesting test cases

The suggestions were reviewed before being applied.

## AI-Assisted Evaluation

The project architecture allows an AI-based evaluator to be introduced through the evaluator strategy abstraction.

However, the MVP currently uses the deterministic rule-based evaluator as the default evaluation mechanism.

This was an intentional decision because it provides:

* predictable results
* explainable feedback
* easier testing
* no dependency on an external LLM provider
* no requirement for an API key during normal project execution

An AI evaluator can be added later without replacing the existing evaluator interface.

## What AI Did Not Decide

AI was not treated as the source of truth for the project.

The following decisions were made based on the assignment requirements and project constraints:

* MVP scope
* selected technologies
* backend architecture
* API structure
* database models
* submission flow
* evaluation criteria
* persistence approach
* frontend routes
* final UI decisions
* testing and verification

## Limitations

The current implementation intentionally keeps the scope small.

Current limitations include:

* The MVP contains a small set of LLD problems.
* Evaluation is rule-based rather than fully semantic.
* Multiple valid LLD designs cannot always be judged with complete contextual understanding by deterministic rules.
* Authentication and multi-user functionality are outside the MVP scope.
* The application is designed as a simple monolith rather than a distributed system.
* Advanced diagram editing is not part of the current MVP.

## Future AI Usage

If an AI evaluator is enabled in a future version, it can be used for aspects that require more contextual reasoning, such as:

* understanding design intent
* evaluating alternative valid designs
* identifying architectural trade-offs
* generating more personalized feedback
* explaining design improvements

The deterministic evaluator can continue handling objective checks while AI handles areas where contextual reasoning is more useful.
