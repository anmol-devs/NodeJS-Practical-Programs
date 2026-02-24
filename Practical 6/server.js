// Ye file ek 'Entrance Point'. Everything starts from here.
// We never write logic in server.js for better maintainability.

const express = require('express');
// Hamne yaha 'express' framework ko bulaya taaki server asani se bna ske. Node se bhi bna skte hai, but express wala simple and easy hota hai. 
const {connectDB} = require('./db_connection'); // Hame connection establish krne wala function nikala hai poore module se.
const studentRoutes = require('./routes/studentRoutes'); // Yaha hamne saare routes vgera nikaal liye taaki operations vgera perform kar ske.

const app = express(); 
// Hamne express ka ek "Instance" (ek treeke ka server object) bnaya, jisse saare kaam isi app variable ke zariye honge. 
app.use(express.json());
// Ise "Middleware" kehte hai. Iska kaam ye hai ki jab koi user JSON data bhejega, to ye use server ke samajhne layak (JavaScrip Object) me badal dega. Iske bina req.body undefined aaegi.

// Connect Database
connectDB(); // ye line connection bnayegi. Jaise hi server chlega, ye line database se connection bna degi. 

// Routes
app.use('/students', studentRoutes);
// Ye server ko bta rha hai ki agar koi bhi request /students se shuru ho (like: http://localhost:3000/students), to use 'studentsRoutes.js' file ke paas bhej do.

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// Project Flow Summary:
// 1. Server start hua (Server.js).
// 2. Database connect hua (db_connection.js).
// 3. User ne request ki /student pe
// 4. Server ne use Routes (studentRoutes.js) par bheja.
// 5. Routes ne use sahi Controller (studentController.js) par bheja.
// 6. Controller ne Database se data laya ya dala or user ko Response de diya.