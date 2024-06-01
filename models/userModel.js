// models/user.js
const db = require("../config/db");

const createUser = async ({ name, email, password, type = "user" }) => {
  const query = `
    INSERT INTO users (name, email, password, type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, email, password, type];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users WHERE email = $1;
  `;

  const result = await db.query(query, [email]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const updateUserCart = async (id, cart) => {
  const result = await db.query(
    "UPDATE users SET cart = $1 WHERE id = $2 RETURNING *",
    [JSON.stringify(cart), id]
  );
  return result.rows[0];
};

const updateUserAddress = async (userId, address) => {
  try {
    const query = `
      UPDATE users
      SET address = $1::jsonb
      WHERE id = $2
      RETURNING *;
    `;
    const values = [address, userId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("User not found or address update failed.");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error updating user address:", error.message);
    throw new Error("Failed to update user address.");
  }
};
const getUserOrders = async (userId) => {
  const query = "SELECT * FROM orders WHERE userId = $1";
  const result = await db.query(query, [userId]);
  return result.rows;
};
module.exports = {
  getUserOrders,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserCart,
  updateUserAddress,
};
