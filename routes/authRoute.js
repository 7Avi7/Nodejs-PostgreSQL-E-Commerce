const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getUserOrders,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserAddress,
  updateUserCart,
} = require("../models/userModel");
const auth = require("../middlewares/authMiddleware");
const { getProductById, deleteProductById } = require("../models/productModel");
const { createOrder } = require("../models/orderModel");

const authRouter = express.Router();

// SignUp Route
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user with email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 8);

    // Create new user
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, "passwordKey");

    res.json({ token, ...newUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SignIn Route
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, "passwordKey");

    res.json({ token, ...user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Validate token
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await getUserById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Save User Address Route
authRouter.post("/api/save-user-address", auth, async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user;

    const updatedUser = await updateUserAddress(userId, address);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "User not found or address update failed." });
    }

    res.json(updatedUser);
  } catch (e) {
    console.error("Error updating user address:", e.message);
    res.status(500).json({ error: "Failed to update user address." });
  }
});

// Get User Data Route
authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await getUserById(req.user);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await getProductById(id);

    let user = await getUserById(req.user);

    if (user.cart == null) user.cart = [];

    let isProductFound = false;
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].id == product.id) {
        isProductFound = true;
        user.cart[i].quantity += 1; // Increment quantity if product exists
        break;
      }
    }

    if (!isProductFound) {
      user.cart.push({ ...product, quantity: 1 }); // Add new product to cart
    }

    user = await updateUserCart(user.id, user.cart);

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Parse id to integer
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Invalid id parameter. Must be an integer." });
    }

    // Example: If you want to delete a product by id
    const deletedProduct = await deleteProductById(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product successfully removed from cart." });
  } catch (e) {
    console.error("Error removing product from cart:", e.message);
    res.status(500).json({ error: "Failed to remove product from cart." });
  }
});

authRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;

    let products = [];
    for (let i = 0; i < cart.length; i++) {
      let product = await getProductById(cart[i].id);
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of stock!` });
      }
    }

    let user = await getUserById(req.user);
    user.cart = []; // Clear cart after placing order

    let order = await createOrder({
      products,
      totalPrice,
      address,
      userId: req.user,
      orderedAt: new Date().getTime(),
      status: "Pending",
    });

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get("/api/orders/me", auth, async (req, res) => {
  try {
    const orders = await getUserOrders(req.user);
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
