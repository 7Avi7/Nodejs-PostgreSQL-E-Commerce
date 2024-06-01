// routes/adminRoute.js
const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/adminMiddleware");
const {
  createProduct,
  getProductById,
  getAllProducts,
  getProductsByCategory,
  searchProductsByName,
  deleteProductById,
} = require("../models/productModel");
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../models/orderModel");

// Add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, images, quantity, price, category } = req.body;
    const product = await createProduct({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all products
adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete a product
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await deleteProductById(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all orders
adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Change order status
adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await getOrderById(id);
    order = await updateOrderStatus(id, status);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Analytics endpoint
adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try {
    const orders = await getAllOrders();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found." });
    }

    let totalEarnings = 0;
    let mobileEarnings = 0;
    let essentialEarnings = 0;
    let applianceEarnings = 0;
    let booksEarnings = 0;
    let fashionEarnings = 0;

    orders.forEach((order) => {
      console.log(
        `Order ID: ${order.id}, Products: ${JSON.stringify(order.products)}`
      );

      order.products.forEach((product) => {
        console.log(
          `Product: ${product.name}, Quantity: ${product.quantity}, Price: ${product.price}, Category: ${product.category}`
        );

        // Calculate total earnings
        totalEarnings += product.quantity * product.price;

        // Calculate earnings per category
        switch (product.category) {
          case "Mobiles":
            mobileEarnings += product.quantity * product.price;
            break;
          case "Essentials":
            essentialEarnings += product.quantity * product.price;
            break;
          case "Appliances":
            applianceEarnings += product.quantity * product.price;
            break;
          case "Books":
            booksEarnings += product.quantity * product.price;
            break;
          case "Fashion":
            fashionEarnings += product.quantity * product.price;
            break;
          default:
            break;
        }
      });
    });

    const earnings = {
      totalEarnings,
      mobileEarnings,
      essentialEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings,
    };

    res.json(earnings);
  } catch (e) {
    console.error("Error fetching analytics:", e.message);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }
});

module.exports = adminRouter;
