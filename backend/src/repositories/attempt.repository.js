import { Attempt } from "../models/attempt.model.js";

export class AttemptRepository {
  async create(data) {
    const attempt = new Attempt(data);
    return attempt.save();
  }

  async findById(id) {
    return Attempt.findById(id).populate("problemId", "title difficulty");
  }

  async findAll() {
    return Attempt.find()
      .populate("problemId", "title difficulty")
      .sort({ createdAt: -1 });
  }

  async findByProblemId(problemId) {
    return Attempt.find({ problemId })
      .populate("problemId", "title difficulty")
      .sort({ createdAt: -1 });
  }

  async countByProblemId(problemId) {
    return Attempt.countDocuments({ problemId });
  }

  async updateStatus(id, status) {
    return Attempt.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }

  async update(id, data) {
    return Attempt.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  }
}

export const attemptRepository = new AttemptRepository();
