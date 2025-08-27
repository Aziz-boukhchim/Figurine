const Figurine = require("../models/FigurinesModel");

// GET all figurines (unchanged)
const getAllFigurines = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const figurines = await Figurine.find(filter);
    res.status(200).json(figurines);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch figurines", error: err.message });
  }
};

// Add new Figurine — expects image URLs in req.body.images (no files)
const addFigurine = async (req, res) => {
  try {
    const { title, description, category, price, images, inStock } = req.body;

    // Validate required fields, including images array
    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({ message: "All required fields and at least one image URL are required" });
    }

    const newFigurine = new Figurine({
      title,
      description,
      category,
      price,
      images, // Store array of image URLs from frontend
      inStock: inStock ?? true,
    });

    const savedFigurine = await newFigurine.save();
    res.status(201).json(savedFigurine);
  } catch (err) {
    res.status(500).json({ message: "Failed to add figurine", error: err.message });
  }
};

// UPDATE, DELETE, GET BY ID remain unchanged:
const updateFigurine = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedFigurine = await Figurine.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedFigurine) {
      return res.status(404).json({ message: "Figurine not found" });
    }

    res.status(200).json(updatedFigurine);
  } catch (err) {
    res.status(500).json({ message: "Failed to update figurine", error: err.message });
  }
};

const deleteFigurine = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFigurine = await Figurine.findByIdAndDelete(id);

    if (!deletedFigurine) {
      return res.status(404).json({ message: "Figurine not found" });
    }

    res.status(200).json({ message: "Figurine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete figurine", error: err.message });
  }
};

const getFigurineById = async (req, res) => {
  const { id } = req.params;

  try {
    const figurine = await Figurine.findById(id);

    if (!figurine) {
      return res.status(404).json({ message: "Figurine not found" });
    }

    res.status(200).json(figurine);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch figurine", error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Figurine.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};



module.exports = {
  getAllFigurines,
  addFigurine,
  updateFigurine,
  deleteFigurine,
  getFigurineById,
  getCategories,
};
