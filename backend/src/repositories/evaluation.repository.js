import { Evaluation } from "../models/evaluation.model.js";

export class EvaluationRepository {
  async create(data) {
    const evaluation = new Evaluation(data);
    return evaluation.save();
  }

  async findById(id) {
    return Evaluation.findById(id).populate("submissionId");
  }

  async findBySubmissionId(submissionId) {
    return Evaluation.findOne({ submissionId }).populate("submissionId");
  }

  async update(id, data) {
    return Evaluation.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  }
}

export const evaluationRepository = new EvaluationRepository();
