const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getActivityFeed,
  searchUsers,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/search", searchUsers);
router.get("/feed", getActivityFeed);
router.put("/profile", updateProfile);
router.get("/:id", getProfile);
router.post("/:id/follow", followUser);
router.post("/:id/unfollow", unfollowUser);

module.exports = router;