const coachOnly = (req, res, next) => {
  if (req.user && req.user.role === "coach") {
    return next();
  }
  return res.status(403).json({
    message: "Access denied. Coach role required.",
  });
};

module.exports = { coachOnly };