import React, { useMemo } from "react";
import {
  HelpCircle,
  Boxes,
  Briefcase,
  GitFork,
  Cpu,
  ShieldAlert,
  FileText
} from "lucide-react";
import ClassCardList from "./ClassCardList";
import RelationshipEditor from "./RelationshipEditor";
import DesignPatternSelector from "./DesignPatternSelector";
import ArchitecturePreview from "./ArchitecturePreview";
import {
  serializeCoreClasses,
  deserializeCoreClasses,
  serializeRelationships,
  deserializeRelationships,
  serializeDesignPatterns,
  deserializeDesignPatterns
} from "../utils/lldSerializer";

export const FORM_SECTIONS = [
  {
    key: "assumptions",
    title: "1. Assumptions & Operational Boundaries",
    prompt: "What operational, scaling, or hardware assumptions are you making?",
    placeholder: "e.g., Supported vehicle sizes, payment terminal boundaries, single vs multi-entrance rate limits, peak burst requirements...",
    icon: HelpCircle,
    minRows: 4,
    type: "textarea"
  },
  {
    key: "coreClasses",
    title: "2. Core Classes & Entities",
    prompt: "Define the fundamental classes, entities, and services that encapsulate your design.",
    icon: Boxes,
    type: "classes"
  },
  {
    key: "responsibilities",
    title: "3. Responsibilities (Single Responsibility Principle)",
    prompt: "What responsibility does each important class have? How is separation of concerns preserved?",
    placeholder: "e.g., Which class coordinates spot searches? Which calculates fees? Who validates and invalidates tickets? How do domain entities avoid leaking persistence logic?",
    icon: Briefcase,
    minRows: 5,
    type: "textarea"
  },
  {
    key: "relationships",
    title: "4. Relationships & Structural Hierarchy",
    prompt: "Express relationships between classes (contains, has-a, inherits, implements, uses).",
    icon: GitFork,
    type: "relationships"
  },
  {
    key: "designPatterns",
    title: "5. Design Patterns & Abstractions",
    prompt: "Which design patterns, abstractions, or interfaces would you use and why?",
    icon: Cpu,
    type: "patterns"
  },
  {
    key: "edgeCases",
    title: "6. Edge Cases & Concurrency Handling",
    prompt: "What edge cases, race conditions, or fault boundaries should your design handle?",
    placeholder: "e.g., Lot full status, lost ticket, simultaneous gate arrivals (race conditions & synchronization), car occupying oversized spot...",
    icon: ShieldAlert,
    minRows: 4,
    type: "textarea"
  },
  {
    key: "explanation",
    title: "7. Architectural Explanation & Trade-offs",
    prompt: "Explain your overall architecture, testability approach, and key design trade-offs.",
    placeholder: "Discuss thread-safety, lock granularity, memory overhead, decoupled testing strategy, extensibility for future requirements, and why you preferred this structure...",
    icon: FileText,
    minRows: 7,
    type: "textarea",
    large: true
  }
];

export default function SolutionForm({ formData, onChange }) {
  // Deserialized or cached structured representations
  const classes = useMemo(() => {
    return formData._classes || deserializeCoreClasses(formData.coreClasses);
  }, [formData._classes, formData.coreClasses]);

  const relationships = useMemo(() => {
    return formData._relationships || deserializeRelationships(formData.relationships);
  }, [formData._relationships, formData.relationships]);

  const patterns = useMemo(() => {
    return formData._patterns || deserializeDesignPatterns(formData.designPatterns);
  }, [formData._patterns, formData.designPatterns]);

  const handleTextChange = (key, value) => {
    onChange({
      ...formData,
      [key]: value
    });
  };

  const handleClassesChange = (newClasses) => {
    const serialized = serializeCoreClasses(newClasses);
    onChange({
      ...formData,
      coreClasses: serialized,
      _classes: newClasses
    });
  };

  const handleRelationshipsChange = (newRelations) => {
    const serialized = serializeRelationships(newRelations);
    onChange({
      ...formData,
      relationships: serialized,
      _relationships: newRelations
    });
  };

  const handlePatternsChange = (newPatterns) => {
    const serialized = serializeDesignPatterns(newPatterns);
    onChange({
      ...formData,
      designPatterns: serialized,
      _patterns: newPatterns
    });
  };

  return (
    <div className="solution-form">
      {/* Live Architecture Visual Preview when entities are present */}
      <ArchitecturePreview
        classes={classes}
        relationships={relationships}
        patterns={patterns}
      />

      {FORM_SECTIONS.map((sec) => {
        const Icon = sec.icon;

        if (sec.type === "classes") {
          return (
            <div key={sec.key} className="form-section" id={`section-${sec.key}`}>
              <div className="form-section-header">
                <div>
                  <div className="form-section-title-wrap">
                    <div className="form-section-icon">
                      <Icon size={19} />
                    </div>
                    <h3 className="form-section-title">{sec.title}</h3>
                  </div>
                  <p className="form-section-prompt">{sec.prompt}</p>
                </div>

                <span className="section-counter">
                  {classes.length} {classes.length === 1 ? "class" : "classes"} {classes.length > 0 && "✓"}
                </span>
              </div>

              <ClassCardList
                classes={classes}
                onChange={handleClassesChange}
              />
            </div>
          );
        }

        if (sec.type === "relationships") {
          return (
            <div key={sec.key} className="form-section" id={`section-${sec.key}`}>
              <div className="form-section-header">
                <div>
                  <div className="form-section-title-wrap">
                    <div className="form-section-icon">
                      <Icon size={19} />
                    </div>
                    <h3 className="form-section-title">{sec.title}</h3>
                  </div>
                  <p className="form-section-prompt">{sec.prompt}</p>
                </div>

                <span className="section-counter">
                  {relationships.length} {relationships.length === 1 ? "link" : "links"} {relationships.length > 0 && "✓"}
                </span>
              </div>

              <RelationshipEditor
                relationships={relationships}
                availableClasses={classes}
                onChange={handleRelationshipsChange}
              />
            </div>
          );
        }

        if (sec.type === "patterns") {
          return (
            <div key={sec.key} className="form-section" id={`section-${sec.key}`}>
              <div className="form-section-header">
                <div>
                  <div className="form-section-title-wrap">
                    <div className="form-section-icon">
                      <Icon size={19} />
                    </div>
                    <h3 className="form-section-title">{sec.title}</h3>
                  </div>
                  <p className="form-section-prompt">{sec.prompt}</p>
                </div>

                <span className="section-counter">
                  {patterns.length} selected {patterns.length > 0 && "✓"}
                </span>
              </div>

              <DesignPatternSelector
                patterns={patterns}
                onChange={handlePatternsChange}
              />
            </div>
          );
        }

        // Standard Textarea Sections
        const value = formData[sec.key] || "";
        const charCount = value.length;

        return (
          <div key={sec.key} className="form-section" id={`section-${sec.key}`}>
            <div className="form-section-header">
              <div>
                <div className="form-section-title-wrap">
                  <div className="form-section-icon">
                    <Icon size={19} />
                  </div>
                  <h3 className="form-section-title">{sec.title}</h3>
                </div>
                <p className="form-section-prompt">{sec.prompt}</p>
              </div>

              <span className="section-counter">
                {charCount} chars {charCount > 0 && "✓"}
              </span>
            </div>

            <textarea
              className={`form-textarea ${sec.large ? "form-textarea-lg" : ""}`}
              placeholder={sec.placeholder}
              value={value}
              onChange={(e) => handleTextChange(sec.key, e.target.value)}
              rows={sec.minRows}
              id={`input-${sec.key}`}
              aria-label={sec.title}
              style={{
                fontSize: "0.96rem",
                lineHeight: 1.6
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
