/**
 * Serialization and Deserialization utilities for LLD practice workspace.
 *
 * Converts structured classes, relationships, and design pattern selections into
 * clean, human-readable strings for backend evaluation models, with embedded
 * metadata tokens for 100% lossless client-side reconstruction.
 */

// ---------------------------------------------------------------------------
// Core Classes
// ---------------------------------------------------------------------------

export function serializeCoreClasses(classes = []) {
  if (!classes || classes.length === 0) return "";

  const humanReadableBlocks = classes.map((cls) => {
    const name = cls.name?.trim() || "UnnamedClass";
    const resp = cls.responsibility?.trim() || "";
    const methods = Array.isArray(cls.methods)
      ? cls.methods.filter(Boolean).join(", ")
      : (cls.methods || "").trim();

    let block = `Class: ${name}`;
    if (resp) block += `\nResponsibility: ${resp}`;
    if (methods) block += `\nMethods: ${methods}`;
    return block;
  });

  const metadata = JSON.stringify(classes);
  return `${humanReadableBlocks.join("\n\n")}\n\n<!--__LLD_CLASSES__:${metadata}-->`;
}

export function deserializeCoreClasses(text = "") {
  if (!text || typeof text !== "string") return [];

  // 1. Attempt exact metadata extraction
  const metaMatch = text.match(/<!--__LLD_CLASSES__:(.*?)-->/s);
  if (metaMatch && metaMatch[1]) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback to heuristic parser below
    }
  }

  // 2. Clean out metadata comments if present
  const cleanText = text.replace(/<!--__LLD_CLASSES__:.*?-->/gs, "").trim();
  if (!cleanText) return [];

  // 3. Heuristic parser for "Class: ..." blocks
  if (/Class\s*:/i.test(cleanText)) {
    const blocks = cleanText.split(/\n\s*(?=Class\s*:)/i);
    return blocks
      .map((block, idx) => {
        const nameMatch = block.match(/Class\s*:\s*([^\n]+)/i);
        const respMatch = block.match(/Responsibility\s*:\s*([^\n]+)/i);
        const methMatch = block.match(/Methods\s*:\s*([^\n]+)/i);

        if (!nameMatch) return null;
        const name = nameMatch[1].trim();
        const responsibility = respMatch ? respMatch[1].trim() : "";
        const methodsRaw = methMatch ? methMatch[1].trim() : "";
        const methods = methodsRaw
          ? methodsRaw.split(",").map((m) => m.trim()).filter(Boolean)
          : [];

        return {
          id: `class-${idx}-${Date.now()}`,
          name,
          responsibility,
          methods
        };
      })
      .filter(Boolean);
  }

  // 4. Fallback for simple bullet-point format (e.g. "- ParkingLot: description")
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);
  const classes = [];
  lines.forEach((line, idx) => {
    const bulletMatch = line.match(/^[-*•]?\s*([A-Za-z0-9_]+)\s*[:\-]\s*(.*)$/);
    if (bulletMatch) {
      classes.push({
        id: `class-${idx}-${Date.now()}`,
        name: bulletMatch[1].trim(),
        responsibility: bulletMatch[2].trim(),
        methods: []
      });
    }
  });

  return classes;
}

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

export function serializeRelationships(relationships = []) {
  if (!relationships || relationships.length === 0) return "";

  const humanReadableLines = relationships
    .filter((r) => r.from && r.to)
    .map((r) => {
      const type = r.type?.trim() || "associates with";
      return `${r.from.trim()} -> ${type} -> ${r.to.trim()}`;
    });

  if (humanReadableLines.length === 0) return "";

  const metadata = JSON.stringify(relationships);
  return `${humanReadableLines.join("\n")}\n\n<!--__LLD_RELATIONSHIPS__:${metadata}-->`;
}

export function deserializeRelationships(text = "") {
  if (!text || typeof text !== "string") return [];

  // 1. Attempt exact metadata extraction
  const metaMatch = text.match(/<!--__LLD_RELATIONSHIPS__:(.*?)-->/s);
  if (metaMatch && metaMatch[1]) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback to heuristic parser below
    }
  }

  // 2. Clean out metadata comments if present
  const cleanText = text.replace(/<!--__LLD_RELATIONSHIPS__:.*?-->/gs, "").trim();
  if (!cleanText) return [];

  // 3. Heuristic parser for "A -> type -> B" or "A → type → B"
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);
  const relations = [];

  lines.forEach((line, idx) => {
    const parts = line.split(/\s*(?:->|→)\s*/);
    if (parts.length >= 3) {
      relations.push({
        id: `rel-${idx}-${Date.now()}`,
        from: parts[0].trim(),
        type: parts[1].trim(),
        to: parts[2].trim()
      });
    } else if (parts.length === 2) {
      relations.push({
        id: `rel-${idx}-${Date.now()}`,
        from: parts[0].trim(),
        type: "associates with",
        to: parts[1].trim()
      });
    }
  });

  return relations;
}

// ---------------------------------------------------------------------------
// Design Patterns
// ---------------------------------------------------------------------------

export function serializeDesignPatterns(patterns = []) {
  if (!patterns || patterns.length === 0) return "";

  const humanReadableLines = patterns.map((p) => {
    const name = p.name?.trim() || "Pattern";
    const reason = p.reason?.trim() || "";
    return reason ? `- ${name}: ${reason}` : `- ${name}`;
  });

  const metadata = JSON.stringify(patterns);
  return `${humanReadableLines.join("\n")}\n\n<!--__LLD_PATTERNS__:${metadata}-->`;
}

export function deserializeDesignPatterns(text = "") {
  if (!text || typeof text !== "string") return [];

  // 1. Attempt exact metadata extraction
  const metaMatch = text.match(/<!--__LLD_PATTERNS__:(.*?)-->/s);
  if (metaMatch && metaMatch[1]) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback
    }
  }

  // 2. Clean out metadata comments
  const cleanText = text.replace(/<!--__LLD_PATTERNS__:.*?-->/gs, "").trim();
  if (!cleanText) return [];

  // 3. Extract bullets
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);
  const patterns = [];

  lines.forEach((line) => {
    const match = line.match(/^[-*•]?\s*([A-Za-z\s]+)(?::\s*(.*))?$/);
    if (match) {
      patterns.push({
        name: match[1].trim(),
        reason: (match[2] || "").trim()
      });
    }
  });

  return patterns;
}
