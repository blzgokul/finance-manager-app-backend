const User = require("../models/User");

/* =========================
   GET USER PROFILE
========================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =========================
   UPDATE USER PROFILE
========================= */
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      currency,
      notificationsEnabled,
      preferredCategories,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        // update only allowed fields
        ...(name !== undefined && { name }),
        ...(currency !== undefined && { currency }),
        ...(notificationsEnabled !== undefined && {
          notificationsEnabled,
        }),
        ...(preferredCategories !== undefined && {
          preferredCategories,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};