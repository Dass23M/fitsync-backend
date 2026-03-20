const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Exercise name is required"],
    trim: true,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    enum: ["kg", "lbs"],
    default: "kg",
  },
  notes: {
    type: String,
    default: "",
  },
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Workout title is required"],
      trim: true,
    },
    exercises: [exerciseSchema],
    muscleGroups: [
      {
        type: String,
        enum: [
          "chest",
          "back",
          "shoulders",
          "arms",
          "legs",
          "core",
          "cardio",
          "full body",
        ],
      },
    ],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: {
      type: Number,
      required: [true, "Duration in minutes is required"],
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);