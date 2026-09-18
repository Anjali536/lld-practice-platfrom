import { Problem } from "../models/problem.model.js";

export class ProblemRepository {
  async findAll() {
    return Problem.find().sort({ createdAt: 1 });
  }

  async findById(id) {
    return Problem.findById(id);
  }

  async findByTitle(title) {
    return Problem.findOne({ title });
  }

  async create(data) {
    const problem = new Problem(data);
    return problem.save();
  }
}

export const problemRepository = new ProblemRepository();
