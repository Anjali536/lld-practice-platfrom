import mongoose from "mongoose";

const submissionContentSchema = new mongoose.Schema(
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

const submissionSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attempt",
      required: true
    },
    type: {
      type: String,
      enum: ["TEXT"],
      default: "TEXT",
      required: true
    },
    content: {
      type: submissionContentSchema,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Submission = mongoose.model("Submission", submissionSchema);
