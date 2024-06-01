const express = require("express");
const productRouter = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getProductById,
  getAllProducts,
  getProductsByCategory,
  searchProductsByName,
} = require("../models/productModel");

// Get product by ID
productRouter.get("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all products
productRouter.get("/api/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get products by category
productRouter.get("/api/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await getProductsByCategory(category);
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Search products by name
productRouter.get("/api/products/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const products = await searchProductsByName(name);
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
