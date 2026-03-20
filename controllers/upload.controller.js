const { cloudinary } = require("../config/cloudinary");
const User = require("../models/User");
const Workout = require("../models/Workout");

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const oldAvatar = req.user.avatar;
    if (oldAvatar) {
      const publicId = oldAvatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`fitsync/${publicId}`);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: req.file.path } },
      { new: true }
    );

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadWorkoutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const oldImage = workout.image;
    if (oldImage) {
      const publicId = oldImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`fitsync/${publicId}`);
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: { image: req.file.path } },
      { new: true }
    );

    res.status(200).json({
      message: "Workout image uploaded successfully",
      image: updated.image,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadAvatar, uploadWorkoutImage };