const Workout = require("../models/Workout");
const Activity = require("../models/Activity");

const createWorkout = async (req, res) => {
  try {
    const { title, exercises, muscleGroups, difficulty, duration, notes } = req.body;

    if (!title || !exercises || !duration) {
      return res.status(400).json({ message: "Title, exercises and duration are required" });
    }

    const workout = await Workout.create({
      user: req.user._id,
      title,
      exercises,
      muscleGroups,
      difficulty,
      duration,
      notes,
    });

    await Activity.create({
      user: req.user._id,
      type: "workout_logged",
      workout: workout._id,
    });

    const io = req.app.get("io");
    io.emit("workout:new", {
      userId: req.user._id,
      userName: req.user.name,
      workoutTitle: workout.title,
    });

    res.status(201).json({ message: "Workout created successfully", workout });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllWorkouts = async (req, res) => {
  try {
    const {
      search,
      muscleGroup,
      difficulty,
      minDuration,
      maxDuration,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { user: req.user._id };

    if (muscleGroup) {
      filter.muscleGroups = { $in: [muscleGroup] };
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) filter.duration.$gte = Number(minDuration);
      if (maxDuration) filter.duration.$lte = Number(maxDuration);
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Workout.countDocuments(filter);
    const workouts = await Workout.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name avatar")
      .lean();

    res.status(200).json({
      workouts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      totalWorkouts: total,
    });
  } catch (error) {
    console.error("GET WORKOUTS ERROR:", error.message);
    console.error("STACK:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate(
      "user",
      "name avatar"
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ workout });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Workout updated successfully", workout: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await workout.deleteOne();

    await Activity.deleteMany({ workout: req.params.id });

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};