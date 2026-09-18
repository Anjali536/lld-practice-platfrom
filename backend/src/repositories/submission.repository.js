import { Submission } from "../models/submission.model.js";

export class SubmissionRepository {
  async create(data) {
    const submission = new Submission(data);
    return submission.save();
  }

  async findById(id) {
    return Submission.findById(id).populate("attemptId");
  }

  async findByAttemptId(attemptId) {
    return Submission.findOne({ attemptId }).populate("attemptId");
  }
}

export const submissionRepository = new SubmissionRepository();
