const Plan = require("../models/Plan");
const Activity = require("../models/Activity");

const createPlan = async (req, res) => {
  try {
    const { title, description, difficulty, durationWeeks, workouts } = req.body;

    if (!title || !durationWeeks) {
      return res.status(400).json({ message: "Title and duration are required" });
    }

    const plan = await Plan.create({
      coach: req.user._id,
      title,
      description,
      difficulty,
      durationWeeks,
      workouts,
    });

    await Activity.create({
      user: req.user._id,
      type: "plan_created",
      plan: plan._id,
    });

    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    console.error("CREATE PLAN ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const {
      difficulty,
      minWeeks,
      maxWeeks,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (difficulty) filter.difficulty = difficulty;

    if (minWeeks || maxWeeks) {
      filter.durationWeeks = {};
      if (minWeeks) filter.durationWeeks.$gte = Number(minWeeks);
      if (maxWeeks) filter.durationWeeks.$lte = Number(maxWeeks);
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Plan.countDocuments(filter);

    const plans = await Plan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("coach", "name avatar")
      .populate("workouts", "title duration difficulty")
      .lean();

    res.status(200).json({
      plans,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      totalPlans: total,
    });
  } catch (error) {
    console.error("GET PLANS ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate("coach", "name avatar")
      .populate("workouts", "title duration difficulty muscleGroups")
      .lean();

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error("GET PLAN ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Plan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Plan updated successfully", plan: updated });
  } catch (error) {
    console.error("UPDATE PLAN ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await plan.deleteOne();
    await Activity.deleteMany({ plan: req.params.id });

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("DELETE PLAN ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};