const express = require('express');
const app = express();

app.use(express.json()); // middleware to parse JSON

// In-memory database
let students = [
    { id: 1, name: "Ajay", age: 20 },
    { id: 2, name: "Amit", age: 21 }
];

let nextId = 3;

/*
--------------------------------------
1. GET ALL STUDENTS
--------------------------------------
*/
app.get('/students', (req, res) => {
    res.json(students);
});

/*
--------------------------------------
2. GET SINGLE STUDENT
--------------------------------------
*/
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
});

/*
--------------------------------------
3. ADD STUDENT
--------------------------------------
*/
app.post('/students', (req, res) => {
    const { name, age } = req.body;

    if (!name || !age) {
        return res.status(400).json({ message: "Name and age required" });
    }

    const newStudent = {
        id: nextId++,
        name,
        age
    };

    students.push(newStudent);
    res.status(201).json(newStudent);
});

/*
--------------------------------------
4. UPDATE STUDENT
--------------------------------------
*/
app.put('/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, age } = req.body;

    if (name) student.name = name;
    if (age) student.age = age;

    res.json(student);
});

/*
--------------------------------------
5. DELETE STUDENT
--------------------------------------
*/
app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deletedStudent = students.splice(index, 1);
    res.json(deletedStudent);
});

/*
--------------------------------------
SERVER
--------------------------------------
*/
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});