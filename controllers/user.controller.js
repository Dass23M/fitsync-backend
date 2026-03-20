const User = require("../models/User");
const Activity = require("../models/Activity");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name avatar")
      .populate("following", "name avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, bio } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = req.user.following.includes(req.params.id);
    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user._id },
    });

    await Activity.create({
      user: req.user._id,
      type: "user_followed",
      targetUser: req.params.id,
    });

    const io = req.app.get("io");
    io.emit("follow:new", {
      followerId: req.user._id,
      followerName: req.user.name,
      targetUserId: req.params.id,
    });

    res.status(200).json({ message: `You are now following ${targetUser.name}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = req.user.following.includes(req.params.id);
    if (!isFollowing) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });

    res.status(200).json({ message: `You unfollowed ${targetUser.name}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getActivityFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const followingIds = currentUser.following;

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Activity.countDocuments({
      user: { $in: followingIds },
    });

    const activities = await Activity.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name avatar")
      .populate("workout", "title duration")
      .populate("plan", "title durationWeeks")
      .populate("targetUser", "name avatar");

    res.status(200).json({
      activities,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalActivities: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("name avatar bio role followers following")
      .limit(20);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getActivityFeed,
  searchUsers,
};