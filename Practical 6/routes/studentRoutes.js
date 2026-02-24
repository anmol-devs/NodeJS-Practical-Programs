// Ye file hmare project ki "Traffic Police" hai. Iska kaam hai ye decide krna ki konsi request (post, get, etc.) kis Controller function ke paas jaaegi.

const express = require('express');
const router = express.Router();
// Ye 'express' library ka ek tool hai, jo hame alag-alag files me routes (paths) bnane ki permission deta hai. 

const {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController');
// Yaha vahi Object Destructuring ka use kra hai jo 'studentController.js' file me kri thi. Ham studentController file se saare functions nikaal rhe hai taake unhe use kr ske, routes assign kr ske.

// Neeche routes define kre hai.
router.post('/', addStudent); 
// Jab koi user root path (/) par POST request bhejega, toh server addStudents wala function ko chla dega.
router.get('/', getStudents);
router.patch('/:id', updateStudent); 
// Yaha '/:id' means 'Dynamic ID', means url kuch bhi ho skta hai us particular student ka, jo id denge url me uske according hoga.
router.delete('/:id', deleteStudent);

module.exports = router;
// Hamne yaha is poore Router ko export kar liya, jise ab ham apni main file 'server.js' me import krke use krenge. Aise alag alag modules me kaam karne ka ye faida hai ki hmara code clean rehta hai, and maintainability, readability, etc. bhadiya rhti hai.