const Product = require('../models/productModel');

let products = [
  new Product(1, "Laptop", 50000),
  new Product(2, "Mobile", 20000),
  new Product(3, "Headphones", 2000)
];

// Get all products
const getAllProducts = () => products;

// Get product by ID
const getProductById = (id) => {
  return products.find(p => p.id == id);
};

// Add product
const addProduct = (data) => {
  const newProduct = new Product(
    products.length + 1,
    data.name,
    data.price
  );
  products.push(newProduct);
  return newProduct;
};

// Update product
const updateProduct = (id, data) => {
  const product = products.find(p => p.id == id);
  if (!product) return null;

  product.name = data.name || product.name;
  product.price = data.price || product.price;

  return product;
};

// Delete product
const deleteProduct = (id) => {
  const index = products.findIndex(p => p.id == id);
  if (index === -1) return null;

  return products.splice(index, 1);
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};