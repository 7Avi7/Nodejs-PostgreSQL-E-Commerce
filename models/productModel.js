// models/productModel.js
const db = require("../config/db");

const getProductById = async (id) => {
  const query = "SELECT * FROM products WHERE id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const createProduct = async ({
  name,
  description,
  images, // Assuming images is an array of strings
  quantity,
  price,
  category,
}) => {
  const query = `
    INSERT INTO products (name, description, images, quantity, price, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  // Convert images array to JSON string for PostgreSQL
  const imagesJson = JSON.stringify(images);

  const values = [name, description, imagesJson, quantity, price, category];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getAllProducts = async () => {
  const query = `
    SELECT * FROM products;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getProductsByCategory = async (category) => {
  const query = "SELECT * FROM products WHERE category = $1";
  const result = await db.query(query, [category]);
  return result.rows;
};

const searchProductsByName = async (name) => {
  const query = "SELECT * FROM products WHERE name ILIKE $1";
  const result = await db.query(query, [`%${name}%`]);
  return result.rows;
};

const deleteProductById = async (id) => {
  const query = `
    DELETE FROM products WHERE id = $1 RETURNING *;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  getProductById,
  createProduct,
  getAllProducts,
  getProductsByCategory,
  searchProductsByName,
  deleteProductById,
};
