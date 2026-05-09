const Resource = require("../models/resources");

exports.getPendingResources = async (req, res, next) => {
  try {
    // populate createdBy → only the name field
    const resources = await Resource.find({ status: "pending" })
      .sort("-createdAt")
      .populate("createdBy", "name");

    res.json({ resources });
  } catch (err) {
    next(err);
  }
};

exports.updateResourceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    resource.status = status;
    await resource.save();
    res.json({ resource });
  } catch (err) {
    next(err);
  }
};
