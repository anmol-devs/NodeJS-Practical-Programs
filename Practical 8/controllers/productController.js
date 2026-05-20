const productService = require('../services/productService');

// Get all products
exports.getProducts = (req, res) => {
    res.json(productService.getAllProducts());
};

// Get by ID
exports.getProduct = (req, res) => {
    const product = productService.getProductById(req.params.id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
};

// POST
exports.createProduct = (req, res) => {
    const product = productService.addProduct(req.body);
    res.status(201).json(product);
};

// PUT
exports.updateProduct = (req, res) => {
    const product = productService.updateProduct(req.params.id, req.body);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
};

// DELETE
exports.deleteProduct = (req, res) => {
    const product = productService.deleteProduct(req.params.id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
};