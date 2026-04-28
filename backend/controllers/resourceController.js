const Resource = require("../models/resources");

exports.createResource = async (req, res, next) => {
  try {
    const { title, type, url, description } = req.body;
    const resource = await Resource.create({
      title,
      type,
      url,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json({ resource });
  } catch (err) {
    next(err);
  }
};

exports.getApprovedResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({ status: "approved" })
      .sort("-createdAt")
      .populate("createdBy", "name specialties"); // ← pull in therapist name + specialties

    res.json({ resources });
  } catch (err) {
    next(err);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (resource.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot modify a reviewed resource" });
    }
    Object.assign(resource, req.body);
    await resource.save();
    res.json({ resource });
  } catch (err) {
    next(err);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getMyResources = async (req, res, next) => {
  try {
    // return *all* resources this therapist created (pending or approved)
    const resources = await Resource.find({ createdBy: req.user.id }).sort(
      "-createdAt"
    );
    res.json({ resources });
  } catch (err) {
    next(err);
  }
};
