const express = require('express');
const {connectDB} = require('./db_connection');
const studentRoutes2 = require('./routes/studentRoutes2'); 

const app = express(); 
app.use(express.json());

// Connect Database
connectDB();
// Routes
app.use('/students', studentRoutes2);

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
