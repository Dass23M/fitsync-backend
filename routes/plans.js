const express = require("express");
const router = express.Router();
const {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} = require("../controllers/plan.controller");
const { protect } = require("../middleware/auth");
const { coachOnly } = require("../middleware/role");

router.use(protect);

router.route("/")
  .get(getAllPlans)
  .post(coachOnly, createPlan);

router.route("/:id")
  .get(getPlanById)
  .put(coachOnly, updatePlan)
  .delete(coachOnly, deletePlan);

module.exports = router;