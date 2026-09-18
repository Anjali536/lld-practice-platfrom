import React from "react";

export default function DifficultyBadge({ difficulty }) {
  const normalized = (difficulty || "Medium").toLowerCase();
  let badgeClass = "badge-medium";

  if (normalized === "easy") badgeClass = "badge-easy";
  else if (normalized === "hard") badgeClass = "badge-hard";

  return (
    <span className={`badge ${badgeClass}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "currentColor",
          display: "inline-block"
        }}
      />
      {difficulty}
    </span>
  );
}
