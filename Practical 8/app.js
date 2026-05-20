const express = require('express');
const app = express();
const PORT = 3000;
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/products',productRoutes);

// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);    
});