// Ye file hmare project ki "Traffic Police" hai. Iska kaam hai ye decide krna ki konsi request (post, get, etc.) kis Controller function ke paas jaaegi.

const express = require('express');
const router = express.Router();

const {
    addManyStudents,
    updateManyStudents,
    deleteManyStudents
} = require('../controllers/studentController2');

// Neeche routes define kre hai.
router.post('/many', addManyStudents);
router.patch('/many/update', updateManyStudents);
router.delete('/many/delete', deleteManyStudents);

module.exports = router;