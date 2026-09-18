import mongoose from "mongoose";

const criterionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    evidence: {
      type: String,
      default: ""
    },
    concern: {
      type: String,
      default: ""
    },
    suggestion: {
      type: String,
      default: ""
    },
    confidence: {
      type: Number,
      default: 0.85
    }
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true
    },
    status: {
      type: String,
      enum: ["EVALUATING", "COMPLETED", "FAILED"],
      default: "EVALUATING",
      required: true
    },
    criteria: {
      type: [criterionSchema],
      default: []
    },
    overallSummary: {
      type: String,
      default: ""
    },
    strengths: {
      type: [String],
      default: []
    },
    improvements: {
      type: [String],
      default: []
    },
    evaluatorType: {
      type: String,
      enum: ["RULE", "AI"],
      default: "RULE"
    },
    model: {
      type: String,
      default: null
    },
    evaluatedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Evaluation = mongoose.model("Evaluation", evaluationSchema);
