const express = require("express");
const router = express.Router();
const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workout.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/")
  .get(getAllWorkouts)
  .post(createWorkout);

router.route("/:id")
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

module.exports = router;