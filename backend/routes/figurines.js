const express = require("express");
const router = express.Router();

const {
  getAllFigurines,
  addFigurine,
  updateFigurine,
  deleteFigurine,
  getFigurineById,
  getCategories,
} = require("../controllers/figurineController");

const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../config/multer");

// GET categories — put this before :id route
router.get('/categories', getCategories);

// GET all figurines (public)
router.get("/", getAllFigurines);

// POST add new figurine (admin + file upload middleware)
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.array("images"),
  addFigurine
);

// PATCH update figurine (admin)
router.patch("/:id", verifyToken, isAdmin, updateFigurine);

// DELETE figurine (admin)
router.delete("/:id", verifyToken, isAdmin, deleteFigurine);

// GET figurine by id (public)
router.get("/:id", getFigurineById);

module.exports = router;
