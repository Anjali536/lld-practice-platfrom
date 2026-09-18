import mongoose from "mongoose";

const draftSchema = new mongoose.Schema(
  {
    assumptions: { type: String, default: "" },
    coreClasses: { type: String, default: "" },
    responsibilities: { type: String, default: "" },
    relationships: { type: String, default: "" },
    designPatterns: { type: String, default: "" },
    edgeCases: { type: String, default: "" },
    explanation: { type: String, default: "" }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    attemptNumber: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "SUBMITTED", "EVALUATING", "COMPLETED", "FAILED"],
      default: "IN_PROGRESS",
      required: true
    },
    draft: {
      type: draftSchema,
      default: () => ({})
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Attempt = mongoose.model("Attempt", attemptSchema);
