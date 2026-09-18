import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      default: "Medium"
    },
    requirements: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    constraints: {
      type: [String],
      default: []
    },
    designConsiderations: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Problem = mongoose.model("Problem", problemSchema);
