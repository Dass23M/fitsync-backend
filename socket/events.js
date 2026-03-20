const User = require("../models/User");
const Activity = require("../models/Activity");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("leave", (userId) => {
      socket.leave(userId);
      console.log(`User ${userId} left their room`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  io.on("workout:new", async (data) => {
    try {
      const { userId, workoutTitle } = data;

      const user = await User.findById(userId).populate("followers", "_id");

      if (!user || !user.followers.length) return;

      user.followers.forEach((follower) => {
        io.to(follower._id.toString()).emit("feed:update", {
          type: "workout_logged",
          message: `${user.name} logged a new workout: ${workoutTitle}`,
          userId,
          userName: user.name,
          userAvatar: user.avatar,
          workoutTitle,
          timestamp: new Date(),
        });
      });
    } catch (error) {
      console.error("Socket workout:new error:", error.message);
    }
  });

  io.on("follow:new", async (data) => {
    try {
      const { followerId, followerName, targetUserId } = data;

      const follower = await User.findById(followerId).select("name avatar");

      io.to(targetUserId).emit("feed:update", {
        type: "user_followed",
        message: `${followerName} started following you`,
        followerId,
        followerName,
        followerAvatar: follower?.avatar,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Socket follow:new error:", error.message);
    }
  });
};

module.exports = initSocket;