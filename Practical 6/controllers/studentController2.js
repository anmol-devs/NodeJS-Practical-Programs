const { ObjectId } = require('mongodb');
const { getDB } = require('../db_connection');

// POST - Add Many Students
async function addManyStudents(req, res) {
    try {
        const db = getDB();

        // Guard clause (most people skip this and regret it)
        // Agar ek se jyada add kr rhe hai to array me krna hoga
        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                error: "Request body must be an array of students"
            });
        }

        const result = await db.collection("students").insertMany(req.body);

        res.status(201).json({
            message: "Multiple Students Added Successfully",
            insertedCount: result.insertedCount,
            insertedIds: result.insertedIds
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

// GET - Get All Students


//PATCH: Update students:
// Many students ko update krne ke liye
async function updateManyStudents(req, res) {
    try {
        const db = getDB();

        const { filter, update } = req.body;

        // Guard clauses (don’t be careless)
        // filter se pehle filter krega sbi ko jinko update krna hai, fir update se update krenge. And ye sb request bhejte waqt json waale me hoga.
        if (!filter || !update) {
            return res.status(400).json({
                error: "Both filter and update are required"
            });
        }

        const result = await db.collection("students").updateMany(
            filter,
            { $set: update }
        );

        res.json({
            message: "Multiple Students Updated Successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

//DELETE - Delete Student
// Delete many students
async function deleteManyStudents(req, res) {
    try {
        const db = getDB();

        const { filter } = req.body;

        // Safety check (important)
        if (!filter || typeof filter !== "object") {
            return res.status(400).json({
                error: "Filter object is required"
            });
        }

        const result = await db.collection("students").deleteMany(filter);

        res.json({
            message: "Multiple Students Deleted Successfully",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}


module.exports = {
    addManyStudents,
    updateManyStudents,
    deleteManyStudents
};