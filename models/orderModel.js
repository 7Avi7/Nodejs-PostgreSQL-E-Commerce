// models/orderModel.js
const db = require("../config/db");

const createOrder = async ({
  products,
  totalPrice,
  address,
  userId,
  orderedAt,
  status,
}) => {
  const query = `
    INSERT INTO orders (products, totalPrice, address, userId, orderedAt, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    JSON.stringify(products), // Ensure products is converted to JSON string
    totalPrice,
    JSON.stringify(address), // Ensure address is converted to JSON string
    userId,
    new Date(orderedAt), // Ensure orderedAt is converted to Date object or timestamp
    status,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};
// Function to fetch order by ID
const getOrderById = async (orderId) => {
  const query = "SELECT * FROM orders WHERE id = $1";
  const values = [orderId];

  try {
    const result = await db.query(query, values);
    return result.rows[0]; // Assuming there's only one order with this ID
  } catch (error) {
    throw new Error(`Error fetching order by ID: ${error.message}`);
  }
};

// Function to update order status
const updateOrderStatus = async (orderId, newStatus) => {
  const query = "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *";
  const values = [newStatus, orderId];

  try {
    const result = await db.query(query, values);
    return result.rows[0]; // Assuming the update returns the updated order
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

// Function to get all orders
const getAllOrders = async () => {
  const query = "SELECT * FROM orders";

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching all orders: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
