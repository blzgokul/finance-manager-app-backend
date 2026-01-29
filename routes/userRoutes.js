const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

/* =========================
   USER PROFILE ROUTES
========================= */

/*
  GET    /api/users/profile
  Get logged-in user's profile
*/
router.get("/profile", protect, getProfile);

/*
  PUT    /api/users/profile
  Update logged-in user's profile & preferences
*/
router.put("/profile", protect, updateProfile);

module.exports = router;