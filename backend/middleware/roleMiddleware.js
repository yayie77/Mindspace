exports.restrictTo =
  () =>
  (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
      return res
        .status(403)
        .json({ message: "Forbidden: users only" });
    }
    next();
  };