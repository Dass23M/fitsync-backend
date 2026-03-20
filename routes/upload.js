const express = require("express");
const router = express.Router();
const {
  uploadAvatar,
  uploadWorkoutImage,
} = require("../controllers/upload.controller");
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.use(protect);

router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.post("/workout/:id", upload.single("image"), uploadWorkoutImage);

module.exports = router;
